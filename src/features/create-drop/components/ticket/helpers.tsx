import { type Action } from '@near-wallet-selector/core';
import { parseNearAmount } from 'keypom-js';

import keypomInstance from '@/lib/keypom';
import {
  calculateDepositCost,
  type TicketMetadataExtra,
  type DateAndTimeInfo,
  type FunderEventMetadata,
  type FunderMetadata,
  type TicketInfoMetadata,
} from '@/lib/eventsHelpers';
import {
  deriveKeyFromPassword,
  encryptPrivateKey,
  exportPublicKeyToBase64,
  generateKeyPair,
  uint8ArrayToBase64,
} from '@/lib/cryptoHelpers';
import { get } from '@/utils/localStorage';
import { KEYPOM_MARKETPLACE_CONTRACT } from '@/constants/common';

import { type TicketDropFormData } from '../../routes/CreateTicketDropPage';

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

export const estimateCosts = async ({
  formData,
  accountId,
  setFormData,
  setCurrentStep,
}: {
  accountId: string;
  formData: TicketDropFormData;
  setFormData: (
    data: TicketDropFormData | ((prev: TicketDropFormData) => TicketDropFormData),
  ) => void;
  setCurrentStep: any;
}) => {
  const eventId = Date.now().toString();
  const masterKey = get('MASTER_KEY');

  const funderInfo = await keypomInstance.viewCall({
    methodName: 'get_funder_info',
    args: { account_id: accountId },
  });
  const funderMetadata: FunderMetadata =
    funderInfo === undefined || funderInfo === null ? {} : JSON.parse(funderInfo.metadata);

  const date: DateAndTimeInfo = {
    startDate: formData.date.value.startDate!.getTime(),
    endDate: formData.date.value.endDate?.getTime() || undefined,
    startTime: formData.date.value.startTime,
    endTime: formData.date.value.endTime,
  };

  const eventMetadata: FunderEventMetadata = {
    name: formData.eventName.value,
    dateCreated: Date.now().toString(),
    description: formData.eventDescription.value,
    location: formData.eventLocation.value,
    date,
    artwork: 'bafybeiehk3mzsj2ih4u4fkvmkfrome3kars7xyy3bxh6xfjquws4flglqa',
    questions: formData.questions.map((question) => ({
      question: question.question,
      required: question.isRequired || false,
    })),
    id: eventId.toString(),
  };

  if (formData.questions.length > 0) {
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

  const drop_ids: string[] = [];
  const drop_configs: any = [];
  const asset_datas: any = [];
  const ticket_information: Record<
    string,
    { max_tickets: number; price: string; sale_start?: number; sale_end?: number }
  > = {};

  for (const ticket of formData.tickets) {
    const dropId = `${Date.now().toString()}-${ticket.name
      .replaceAll(' ', '')
      .toLocaleLowerCase()}`;

    ticket_information[`${dropId}`] = {
      max_tickets: ticket.maxSupply,
      price: parseNearAmount(ticket.price)!.toString(),
      sale_start: ticket.salesValidThrough.startDate
        ? ticket.salesValidThrough.startDate.getTime()
        : undefined,
      sale_end: ticket.salesValidThrough.endDate
        ? ticket.salesValidThrough.endDate.getTime()
        : undefined,
    };

    const dropConfig = {
      metadata: JSON.stringify(ticket),
      add_key_allowlist: [KEYPOM_MARKETPLACE_CONTRACT],
      transfer_key_allowlist: [KEYPOM_MARKETPLACE_CONTRACT],
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

  const { costBreakdown } = calculateDepositCost({
    eventMetadata,
    eventTickets: formData.tickets,
    marketTicketInfo: ticket_information,
  });

  setFormData((prev: TicketDropFormData) => ({
    ...prev,
    costBreakdown,
  }));

  setCurrentStep((prevStep: number) => (prevStep < 3 ? prevStep + 1 : prevStep));
};

export const createPayload = async ({
  accountId,
  formData,
  eventArtworkCid,
  ticketArtworkCids,
}: {
  accountId: string;
  formData: TicketDropFormData;
  eventArtworkCid: string;
  ticketArtworkCids: string[];
}): Promise<Action[]> => {
  const eventId = Date.now().toString();
  const masterKey = get('MASTER_KEY');

  const funderInfo = await keypomInstance.viewCall({
    methodName: 'get_funder_info',
    args: { account_id: accountId },
  });
  const funderMetadata: FunderMetadata =
    funderInfo === undefined || funderInfo === null ? {} : JSON.parse(funderInfo.metadata);

  const date: DateAndTimeInfo = {
    startDate: formData.date.value.startDate!.getTime(),
    endDate: formData.date.value.endDate?.getTime() || undefined,
    startTime: formData.date.value.startTime,
    endTime: formData.date.value.endTime,
  };

  const eventMetadata: FunderEventMetadata = {
    name: formData.eventName.value,
    dateCreated: Date.now().toString(),
    description: formData.eventDescription.value,
    location: formData.eventLocation.value,
    date,
    artwork: eventArtworkCid,
    questions: formData.questions.map((question) => ({
      question: question.question,
      required: question.isRequired || false,
    })),
    id: eventId.toString(),
  };

  if (formData.questions.length > 0) {
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

  const drop_ids: string[] = [];
  const drop_configs: any = [];
  const asset_datas: any = [];
  const ticket_information: Record<
    string,
    { max_tickets: number; price: string; sale_start?: number; sale_end?: number }
  > = {};

  for (const ticket of formData.tickets) {
    const dropId = `${Date.now().toString()}-${ticket.name
      .replaceAll(' ', '')
      .toLocaleLowerCase()}`;

    const passValidThroughTime: DateAndTimeInfo = {
      startDate: ticket.passValidThrough.startDate!.getTime(),
      endDate: ticket.passValidThrough.endDate?.getTime() || undefined,
      startTime: ticket.passValidThrough.startTime,
      endTime: ticket.passValidThrough.endTime,
    };
    const salesValidThroughTime: DateAndTimeInfo = {
      startDate: ticket.salesValidThrough.startDate!.getTime(),
      endDate: ticket.salesValidThrough.endDate?.getTime() || undefined,
      startTime: ticket.salesValidThrough.startTime,
      endTime: ticket.salesValidThrough.endTime,
    };

    const ticketExtra: TicketMetadataExtra = {
      dateCreated: Date.now().toString(),
      price: parseNearAmount(ticket.price)!.toString(),
      salesValidThrough: salesValidThroughTime,
      passValidThrough: passValidThroughTime,
      maxSupply: ticket.maxSupply,
      eventId,
    };

    const ticketNftInfo: TicketInfoMetadata = {
      title: ticket.name,
      description: ticket.description,
      media: ticketArtworkCids.shift() || '',
      extra: JSON.stringify(ticketExtra),
    };

    ticket_information[`${dropId}`] = {
      max_tickets: ticket.maxSupply,
      price: parseNearAmount(ticket.price)!.toString(),
      sale_start: ticket.salesValidThrough.startDate
        ? ticket.salesValidThrough.startDate.getTime()
        : undefined,
      sale_end: ticket.salesValidThrough.endDate
        ? ticket.salesValidThrough.endDate.getTime()
        : undefined,
    };

    const dropConfig = {
      nft_keys_config: {
        token_metadata: ticketNftInfo,
      },
      add_key_allowlist: [KEYPOM_MARKETPLACE_CONTRACT],
      transfer_key_allowlist: [KEYPOM_MARKETPLACE_CONTRACT],
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

  const { costBreakdown } = calculateDepositCost({
    eventMetadata,
    eventTickets: formData.tickets,
    marketTicketInfo: ticket_information,
  });

  const actions: Action[] = [
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
            receiver_id: KEYPOM_MARKETPLACE_CONTRACT,
            method_name: 'create_event',
            args: JSON.stringify({
              event_id: eventId,
              funder_id: accountId,
              ticket_information,
            }),
            attached_deposit: costBreakdown.marketListing,
          },
        },
        gas: '300000000000000',
        deposit: costBreakdown.total,
      },
    },
  ];

  return actions;
};
