import { useEffect, useState } from 'react';
import { getPubFromSecret } from '@keypom/core';
import { useNavigate } from 'react-router-dom';

import { useTicketClaimParams } from '@/hooks/useTicketClaimParams';
import { NotFound404 } from '@/components/NotFound404';
import keypomInstance from '@/lib/keypom';
import {
  type FunderEventMetadata,
  type TicketInfoMetadata,
  type TicketMetadataExtra,
  defaultEventInfo,
  defaultTicketInfo,
  defaultTicketInfoExtra,
} from '@/lib/eventsHelpers';

import TicketQRPage from './TicketQRPage';

export default function TicketPage() {
  const { secretKey } = useTicketClaimParams();
  const navigate = useNavigate();

  // State variables for managing the ticket and event information
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [eventInfo, setEventInfo] = useState<FunderEventMetadata>(defaultEventInfo);
  const [ticketInfo, setTicketInfo] = useState<TicketInfoMetadata>(defaultTicketInfo);
  const [ticketType, setTicketType] = useState<'Basic' | 'Sponsor' | 'Admin'>();

  const [ticketInfoExtra, setTicketInfoExtra] =
    useState<TicketMetadataExtra>(defaultTicketInfoExtra);

  const [eventId, setEventId] = useState('');
  const [funderId, setFunderId] = useState('');

  const onScanned = () => {
    window.location.reload();
  };

  useEffect(() => {
    const getEventInfo = async () => {
      try {
        setIsLoading(true);
        const pubKey = getPubFromSecret(secretKey);
        const keyInfo = await keypomInstance.viewCall({
          methodName: 'get_key_information',
          args: { key: pubKey },
        });
        const drop = await keypomInstance.viewCall({
          methodName: 'get_drop_information',
          args: { drop_id: keyInfo.drop_id },
        });
        const factoryAccount = drop.asset_data[1].config.root_account_id;
        const ticketData = await keypomInstance.viewCall({
          contractId: factoryAccount,
          methodName: 'get_ticket_data',
          args: { drop_id: keyInfo.drop_id },
        });
        setTicketType(ticketData.account_type);

        const maxUses = drop.max_key_uses;
        const curStep = drop.max_key_uses - keyInfo.uses_remaining + 1;

        const ticketMetadata = drop.drop_config.nft_keys_config.token_metadata;
        setTicketInfo(ticketMetadata);
        const ticketExtra = JSON.parse(ticketMetadata.extra);
        setTicketInfoExtra(ticketExtra);
        const eventId: string = ticketExtra.eventId;

        const eventInfo = await keypomInstance.getEventInfo({
          accountId: drop.funder_id,
          eventId,
        });

        console.log('maxUses', maxUses);
        console.log('curStep', curStep);
        console.log('eventInfo', eventInfo);

        if ((maxUses !== 3 && maxUses !== 2) || !eventInfo) {
          console.error('Invalid ticket');
          setIsValid(false);
          setIsLoading(false);
          return;
        }

        // First check if ticket is either GA or sponsor / admin
        // Sponsor / Admin case
        if (maxUses === 2) {
          console.log('Ticket already checked in');
          navigate(`/conference/app/${eventId}#${secretKey}`);
        }

        // General Admissions case
        if (curStep !== 1) {
          console.log('Ticket already checked in');
          navigate(`/conference/app/${eventId}#${secretKey}`);
        }

        setEventInfo(eventInfo);
        setEventId(eventId);
        setFunderId(drop.funder_id);

        // eslint-disable-next-line no-console
        console.log('eventInfo', eventInfo);
        // eslint-disable-next-line no-console
        console.log('Ticket Metadata', ticketMetadata);
        // eslint-disable-next-line no-console
        console.log('Ticket Metadata Extra', ticketExtra);

        setIsLoading(false);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error getting event info: ', e);
        setIsValid(false);
        setIsLoading(false);
      }
    };
    getEventInfo();
  }, [secretKey]);

  if (!isValid) {
    return (
      <NotFound404 header="Ticket not found" subheader="Please check your email and try again" />
    );
  }

  const renderPage = () => {
    switch (ticketType) {
      case 'Basic':
        console.log('Rendering basic ticket');
        return (
          <TicketQRPage
            eventId={eventId}
            eventInfo={eventInfo}
            funderId={funderId}
            isLoading={isLoading}
            secretKey={secretKey}
            ticketInfo={ticketInfo}
            ticketInfoExtra={ticketInfoExtra}
            onScanned={onScanned}
          />
        );
      case 'Sponsor':
        console.log('Rendering Sponsor ticket');
        return <div>Sponsor</div>;
      case 'Admin':
        console.log('Rendering Admin ticket');
        return <div>Admin</div>;
      default:
        return <div>Unknown ticket type</div>;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Placeholder for loading state
  }

  return <div>{renderPage()}</div>;
}
