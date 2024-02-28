import { Button, Heading, HStack, Image, Skeleton, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { DeleteIcon } from '@/components/Icons';
import keypomInstance from '@/lib/keypom';
import { ShareIcon } from '@/components/Icons/ShareIcon';
import { type EventDropMetadata } from '@/lib/eventsHelpers';
import { type ColumnItem } from '@/components/Table/types';

import { type EventData, EventManager, type GetTicketDataFn } from '../../components/EventManager';

const eventTableColumns: ColumnItem[] = [
  {
    id: 'ticketName',
    title: 'Ticket name',
    selector: (row) => row.name,
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: 'numTickets',
    title: 'Number of tickets',
    selector: (row) => {
      // Ensure that soldTickets is a number or can be coerced to a string safely
      const soldTickets = String(row.soldTickets);

      // Check if maxTickets is a number, otherwise use the infinity symbol
      const maxTickets = typeof row.maxTickets === 'number' ? row.maxTickets : '\u221E';

      return `${soldTickets}/${maxTickets}`;
    },
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: 'price',
    title: 'Price per ticket (NEAR)',
    selector: (row) => row.priceNear,
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: 'action',
    title: 'Action',
    selector: (row) => row.action,
    tdProps: {
      display: 'flex',
      justifyContent: 'right',
      verticalAlign: 'middle',
    },
    loadingElement: <Skeleton height="30px" />,
  },
];

export default function EventManagerPage() {
  const navigate = useNavigate();

  const { id: eventId = '' } = useParams();
  const [eventData, setEventData] = useState<EventData>({ name: 'Event Name', artwork: 'loading' });
  const { selector, accountId } = useAuthWalletContext();

  useEffect(() => {
    if (eventId === '') navigate('/drops');
    if (!accountId) return;
    if (!eventId) return;

    const getEventData = async () => {
      const drop = await keypomInstance.getEventDrop({ accountId, eventId });
      const metadata: EventDropMetadata = JSON.parse(drop.drop_config.metadata);
      setEventData({
        name: metadata.eventInfo?.name || 'Untitled',
        artwork: metadata.eventInfo?.artwork || 'loading',
      });
    };
    getEventData();
  }, [eventId, selector, accountId]);

  const getTableRows: GetTicketDataFn = (data, handleDeleteClick) => {
    if (data === undefined) return [];
    console.log(data);

    return data.map((item) => ({
      id: item.id, // Assuming `item` has a `drop_id` property that can serve as `id`
      name: (
        <HStack spacing={4}>
          <Image
            alt={`Event image for ${item.id}`}
            borderRadius="12px"
            boxSize="48px"
            objectFit="contain"
            src={item.artwork}
          />
          <VStack align="left">
            <Heading fontFamily="body" fontSize={{ base: 'xl', md: 'md' }} fontWeight="bold">
              {item.name}
            </Heading>
            <Heading fontFamily="body" fontSize={{ base: 'xl', md: 'md' }} fontWeight="light">
              {item.description}
            </Heading>
            <VStack align="left" spacing={0}>
              <Heading
                color="gray.400"
                fontFamily="body"
                fontSize={{ base: 'xl', md: 'md' }}
                fontWeight="light"
              >
                Purchase through: {item.salesValidThrough}
              </Heading>
              <Heading
                color="gray.400"
                fontFamily="body"
                fontSize={{ base: 'xl', md: 'md' }}
                fontWeight="light"
              >
                Valid through: {item.passValidThrough}
              </Heading>
            </VStack>
          </VStack>
        </HStack>
      ),
      soldTickets: item.soldTickets,
      maxTickets: item.maxTickets,
      priceNear: item.priceNear,
      action: (
        <HStack>
          <Button
            borderRadius="6xl"
            size="md"
            variant="icon"
            onClick={async (e) => {
              e.stopPropagation();
              handleDeleteClick(item.id); // Pass the correct id here
            }}
          >
            <DeleteIcon color="red.400" />
          </Button>
          <Button
            borderRadius="6xl"
            size="md"
            variant="icon"
            onClick={() => {
              navigate(`/gallery/ticket/${(item.id || '').toString()}`);
            }}
          >
            <ShareIcon color="gray.600" height="16px" width="16px" />
          </Button>
        </HStack>
      ),
    }));
  };

  return (
    <EventManager eventData={eventData} getData={getTableRows} tableColumns={eventTableColumns} />
  );
}
