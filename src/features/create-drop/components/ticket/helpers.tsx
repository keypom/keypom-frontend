import { type Wallet } from '@near-wallet-selector/core';

import keypomInstance from '@/lib/keypom';
import {
  calculateDepositCost,
  type FunderEventMetadata,
  type FunderMetadata,
} from '@/lib/eventsHelpers';
import {
  deriveKeyFromPassword,
  encryptPrivateKey,
  exportPublicKeyToBase64,
  generateKeyPair,
  uint8ArrayToBase64,
} from '@/lib/cryptoHelpers';
import { KEYPOM_MARKET_CONTRACT } from '@/constants/common';
import { get } from '@/utils/localStorage';

import { type TicketDropFormData } from '../../routes/CreateTicketDropPage';

import { eventDateToPlaceholder } from './EventInfoForm';

async function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return await new Promise((resolve, reject) => {
    if (!(file instanceof File)) {
      reject(new TypeError('The provided value is not a File.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      // Explicitly assert the result is an ArrayBuffer
      resolve(event.target!.result as ArrayBuffer);
    };
    reader.onerror = (event: ProgressEvent<FileReader>) => {
      // Safely access error code, considering it could be null
      reject(new Error('File reading error: ' + (event.target?.error?.message || 'Unknown error')));
    };
    reader.readAsArrayBuffer(file);
  });
}

export async function serializeMediaForWorker(formData: TicketDropFormData) {
  const arrayBuffers: string[] = [];

  if (formData.eventArtwork.value) {
    try {
      const eventArtworkArrayBuffer = await fileToArrayBuffer(formData.eventArtwork.value);
      arrayBuffers.push(arrayBufferToBase64(eventArtworkArrayBuffer));
    } catch (error) {
      console.error('Error reading event artwork:', error);
    }
  }

  for (const ticket of formData.tickets) {
    if (ticket.artwork) {
      try {
        const ticketArtworkArrayBuffer = await fileToArrayBuffer(ticket.artwork);
        arrayBuffers.push(arrayBufferToBase64(ticketArtworkArrayBuffer));
      } catch (error) {
        console.error('Error reading ticket artwork:', error);
      }
    }
  }
  console.log('Array Buffers: ', arrayBuffers);

  return arrayBuffers;
}

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export const createPayloadAndEstimateCosts = async ({
  wallet,
  formData,
  accountId,
  setFormData,
  setCurrentStep,
  shouldSet = true,
}: {
  wallet: Wallet;
  accountId: string;
  formData: any;
  setFormData: (data: any) => void;
  setCurrentStep: any;
  shouldSet?: boolean;
}): Promise<any[]> => {
  if (!wallet) return [];
  const eventId = Date.now().toString();
  console.log('Event ID: ', eventId);
  const masterKey = get('MASTER_KEY');

  const funderInfo = await keypomInstance.viewCall({
    methodName: 'get_funder_info',
    args: { account_id: accountId },
  });
  const funderMetadata: FunderMetadata =
    funderInfo === undefined || funderInfo === null ? {} : JSON.parse(funderInfo.metadata);
  console.log('Deploying Event: ', formData.eventName.value);

  const date = formData.date.value.endTime
    ? {
        date: {
          from: formData.date.value.startDate!.toISOString(),
          to: formData.date.value.endDate!.toISOString(),
        },
        time: eventDateToPlaceholder('', formData.date.value),
      }
    : {
        date: formData.date.value.startDate!.toISOString(),

        time: eventDateToPlaceholder('', formData.date.value),
      };

  const eventMetadata: FunderEventMetadata = {
    name: formData.eventName.value,
    dateCreated: Date.now().toString(),
    description: formData.eventDescription.value,
    location: formData.eventLocation.value,
    date,
    artwork: formData.eventArtwork.value ? formData.eventArtwork.value : '',
    questions: formData.questions.map((question) => ({
      question: question.question,
      required: question.isRequired || false,
    })),
    id: eventId.toString(),
  };

  if (formData.questions.length > 0) {
    console.log('Event has questions. Generate keypairs');
    const { publicKey, privateKey } = await generateKeyPair();
    const saltBytes = window.crypto.getRandomValues(new Uint8Array(16));
    const saltBase64 = uint8ArrayToBase64(saltBytes);
    const symmetricKey = await deriveKeyFromPassword(masterKey, saltBase64);
    const { encryptedPrivateKeyBase64, ivBase64 } = await encryptPrivateKey(
      privateKey,
      symmetricKey,
    );

    eventMetadata.pubKey = await exportPublicKeyToBase64(publicKey);
    eventMetadata.encPrivKey = encryptedPrivateKeyBase64;
    eventMetadata.iv = ivBase64;
    eventMetadata.salt = saltBase64;
  }

  funderMetadata[eventId] = eventMetadata;
  console.log('Deployed Event: ', eventMetadata);

  const drop_ids: string[] = [];
  const drop_configs: any = [];
  const asset_datas: any = [];
  const ticket_information: Record<
    string,
    { max_tickets: number; price: string; sale_start?: number; sale_end?: number }
  > = {};

  for (const ticket of formData.tickets) {
    const dropId = `${Date.now().toString()}-${(ticket.name as string)
      .replaceAll(' ', '')
      .toLocaleLowerCase()}`;
    ticket.eventId = eventId;
    console.log('Creating ticket: ', ticket);

    if (!shouldSet) {
      const passValidThroughTime =
        ticket.passValidThrough.startDate && ticket.passValidThrough.endDate
          ? {
              date: {
                from: ticket.passValidThrough.startDate.toISOString(),
                to: ticket.passValidThrough.endDate.toISOString(),
              },
              time: eventDateToPlaceholder('', ticket.passValidThrough),
            }
          : {
              date: ticket.passValidThrough.startDate!.toISOString(),

              time: eventDateToPlaceholder('', ticket.passValidThrough),
            };

      const salesValidThroughTime =
        ticket.salesValidThrough.startDate && ticket.salesValidThrough.endDate
          ? {
              date: {
                from: ticket.salesValidThrough.startDate.toISOString(),
                to: ticket.salesValidThrough.endDate.toISOString(),
              },
              time: eventDateToPlaceholder('', ticket.salesValidThrough),
            }
          : {
              date: ticket.salesValidThrough.startDate!.toISOString(),

              time: eventDateToPlaceholder('', ticket.salesValidThrough),
            };

      ticket.salesValidThrough = salesValidThroughTime;
      ticket.passValidThrough = passValidThroughTime;
    }

    ticket_information[`${dropId}`] = {
      max_tickets: ticket.maxSupply,
      price: ticket.price,
      sale_start: ticket.salesValidThrough.startDate
        ? ticket.salesValidThrough.startDate.getTime()
        : undefined,
      sale_end: ticket.salesValidThrough.endDate
        ? ticket.salesValidThrough.endDate.getTime()
        : undefined,
    };

    const dropConfig = {
      metadata: JSON.stringify(ticket),
      add_key_allowlist: [KEYPOM_MARKET_CONTRACT],
      transfer_key_allowlist: [KEYPOM_MARKET_CONTRACT],
    };
    const assetData = [
      {
        uses: 2,
        assets: [null],
        config: {
          permissions: 'claim',
        },
      },
    ];
    drop_ids.push(dropId);
    asset_datas.push(assetData);
    drop_configs.push(dropConfig);
  }

  console.log(`Creating event with ticket information: ${JSON.stringify(ticket_information)}`);

  const funderMetadataString = JSON.stringify(funderMetadata);
  console.log('Funder Metadata: ', funderMetadataString);

  const { marketDeposit, costBreakdown } = calculateDepositCost({
    eventMetadata,
    eventTickets: formData.tickets,
    marketTicketInfo: ticket_information,
  });

  const actions = [
    {
      type: 'FunctionCall',
      params: {
        methodName: 'create_drop_batch',
        args: {
          drop_ids,
          drop_configs,
          asset_datas,
          change_user_metadata: JSON.stringify(funderMetadata),
          on_success: {
            receiver_id: KEYPOM_MARKET_CONTRACT,
            method_name: 'create_event',
            args: JSON.stringify({
              event_id: eventId,
              funder_id: accountId,
              ticket_information,
            }),
            attached_deposit: marketDeposit,
          },
        },
        gas: '300000000000000',
        deposit: costBreakdown.total,
      },
    },
  ];

  if (shouldSet) {
    setFormData((prev: TicketDropFormData) => ({
      ...prev,
      costBreakdown,
      actions,
    }));
  }

  setCurrentStep((prevStep: number) => (prevStep < 3 ? prevStep + 1 : prevStep));
  return actions;
};
