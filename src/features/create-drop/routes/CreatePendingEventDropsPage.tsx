import {
  AbsoluteCenter,
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Heading,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { createDrop, parseNearAmount } from 'keypom-js';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

import { PENDING_EVENT_TICKETS } from '@/constants/common';
import { del, get } from '@/utils/localStorage';
import { type IPendingEventTickets } from '@/types/common';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';

const CreatePendingEventDropsPage = () => {
  const pendingEventTickets = get(PENDING_EVENT_TICKETS);
  const navigate = useNavigate();
  const { account, accountId } = useAuthWalletContext();
  const [ticketsStatuses, setTicketsStatuses] = useState<Record<string, boolean>>({});

  const { tickets = [], eventName = '' }: IPendingEventTickets = pendingEventTickets || {};

  const createTicketDrops = async () => {
    tickets.forEach(async (ticket, index) => {
      const dropId = (Date.now() + index).toString();
      await createDrop({
        dropId,
        useBalance: true,
        wallet: await window.selector.wallet(),
        numKeys: parseInt(ticket.numberOfTickets.toString()),
        metadata: JSON.stringify({
          eventId: eventName.replace(' ', '_'),
          eventName,
          dropName: `${eventName} - ${ticket.name}`,
          wallets: ['mynearwallet', 'herewallet'],
        }),
        config: {
          usesPerKey: 3,
          sale: {
            maxNumKeys: parseInt(ticket.numberOfTickets.toString()),
            pricePerKeyNEAR: parseFloat(ticket.nearPricePerTicket.toString()),
            blocklist: ['satoshi.testnet'],
            autoWithdrawFunds: true,
            start: new Date(ticket.salesStartDate).getTime(),
            end: new Date(ticket.salesEndDate).getTime(),
          },
        },
        fcData: {
          methods: [
            null,
            null,
            [
              {
                receiverId: `nft-v2.keypom.testnet`,
                methodName: 'nft_mint',
                args: '',
                dropIdField: 'mint_id',
                accountIdField: 'receiver_id',
                attachedDeposit: parseNearAmount('0.1') as string,
              },
            ],
          ],
        },
      });
      setTicketsStatuses((statuses) => ({ ...statuses, [ticket.name]: true }));
    });

    del(PENDING_EVENT_TICKETS);
  };

  useEffect(() => {
    if (!eventName || !tickets) {
      console.error('Event name and tickets not found');
      return;
    }

    if (!account) return;

    const allTicketsStatuses = tickets.reduce((statuses, ticket) => {
      return {
        ...statuses,
        [ticket.name]: false,
      };
    }, {});

    setTicketsStatuses(allTicketsStatuses);

    createTicketDrops();
  }, [account]);

  const isAllTicketsCreated = useMemo(
    () => Object.values(ticketsStatuses).filter((status) => !status).length === 0,
    [ticketsStatuses],
  );

  if (tickets.length === 0) {
    return (
      <AbsoluteCenter flexDirection="column">
        <Heading mb={{ base: '5', md: '10' }} minW="100%" textAlign="center">
          No pending tickets found
        </Heading>
      </AbsoluteCenter>
    );
  }

  return (
    <Box h="100%">
      <AbsoluteCenter flexDirection="column">
        <Heading mb={{ base: '5', md: '10' }} minW="100%" textAlign="center">
          Creating your tickets
        </Heading>
        <Grid
          bg="border.box"
          border="2px solid transparent"
          borderRadius="8xl"
          minH="250px"
          placeItems="center"
          px="2"
          py="4"
          w="400px"
        >
          <VStack gap="8">
            {Object.entries(ticketsStatuses).map(([ticketName, isConfirmed]) => {
              return (
                <Flex key={ticketName}>
                  <Box mr="2">
                    {isConfirmed ? (
                      <CheckCircleIcon color="green" h="5" w="5" />
                    ) : (
                      <Spinner h="5" w="5" />
                    )}
                  </Box>
                  <Text>{ticketName}</Text>
                </Flex>
              );
            })}
          </VStack>
        </Grid>
        <Center mt="4">
          {isAllTicketsCreated && (
            <Button
              variant="secondary"
              onClick={() => {
                navigate(`/events/${accountId}`);
              }}
            >
              My Event Page
            </Button>
          )}
        </Center>
      </AbsoluteCenter>
    </Box>
  );
};

export default CreatePendingEventDropsPage;
