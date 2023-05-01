import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Skeleton,
  Spinner,
  Text,
  useBoolean,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { addKeys, formatNearAmount, getUserBalance } from 'keypom-js';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CheckCircleIcon } from '@chakra-ui/icons';

import { IconBox } from '@/components/IconBox';
import { get } from '@/utils/localStorage';
import { PENDING_TICKET_PURCHASE } from '@/constants/common';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import keypomInstance from '@/lib/keypom';
import getConfig from '@/config/config';
import { CopyIcon } from '@/components/Icons';
import { share } from '@/utils/share';
import { DataTable } from '@/components/Table';

const PendingPurchasePage = () => {
  const { publicKeys, secretKeys, dropIds, dropPrices } = get(PENDING_TICKET_PURCHASE) || '{}';

  const [cart, setCart] = useState<Array<{ id: string; link: string[]; dropName: string }>>([]);
  const [ticketStatus, setTicketStatus] = useState<Record<string, boolean>>({});
  const [ticketLoading, setTicketLoading] = useBoolean(true);
  const [loading, setLoading] = useBoolean(true);

  const toast = useToast();
  const navigate = useNavigate();
  const { selector, accountId } = useAuthWalletContext();

  const getBalance = async () => {
    console.log(
      'userbalance:',
      formatNearAmount(await getUserBalance({ accountId: accountId as string }), 4),
    );
  };

  const getDropName = async (dropId: string) => {
    const drop = await keypomInstance.getDropInfo({ dropId });
    const { dropName } = keypomInstance.getDropMetadata(drop.metadata);

    return dropName;
  };

  const getTicketDetails = async () => {
    const ticketDetails = await Promise.all(
      publicKeys.map(async (_, i) => {
        return {
          id: dropIds[i],
          dropName: await getDropName(dropIds[i]),
          link: secretKeys[i],
        };
      }),
    );

    setCart(ticketDetails);

    const allTicketStatus = ticketDetails.reduce((statuses, ticket) => {
      return {
        ...statuses,
        [ticket.dropName]: false,
      };
    });
    setTicketStatus(allTicketStatus);

    setLoading.off();
  };

  const handleCheckout = async () => {
    await Promise.all(
      publicKeys.map(async (_, i) => {
        await getBalance();

        await addKeys({
          wallet: await selector.wallet(),
          publicKeys: publicKeys[i],
          dropId: dropIds[i],
          extraDepositNEAR: dropPrices[i],
          numKeys: publicKeys[i].length,
          useBalance: true,
        });

        const dropName = await getDropName(dropIds[i]);
        setTicketStatus((statuses) => ({ ...statuses, [dropName]: true }));
      }),
    )
      .then(() => {
        setTicketLoading.off();
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (!selector) return;
    getTicketDetails();
    handleCheckout();
  }, [selector]);

  if (loading) {
    return <Spinner h="10" w="10" />;
  } else if (!publicKeys && !dropIds) {
    return <>Cart is empty</>;
  }
  return (
    <Box mb={{ base: '5', md: '14' }} minH="100%" minW="100%" mt={{ base: '52px', md: '100px' }}>
      <Center>
        <VStack gap={{ base: 'calc(24px + 8px)', md: 'calc(32px + 10px)' }}>
          <Heading textAlign="center">Checkout</Heading>

          <IconBox
            minW={{ base: 'inherit', md: '345px' }}
            p="0"
            pb="0"
            w={{ base: '345px', md: '30rem' }}
          >
            <Box
              bg="white"
              borderRadius="8xl"
              pb={{ base: '6', md: '8' }}
              pt={{ base: '6', md: '8' }}
              px={{ base: '6', md: '8' }}
              w="full "
            >
              <VStack>
                {cart.map((ticket, i) => (
                  <HStack key={i}>
                    {!ticketStatus[ticket.dropName] ? (
                      <Spinner h="5" w="5" />
                    ) : (
                      <CheckCircleIcon color="green" h="5" w="5" />
                    )}
                    <Text>{ticket.dropName}</Text>
                  </HStack>
                ))}
              </VStack>
            </Box>
          </IconBox>
          {!ticketLoading &&
            cart.map((ticket, i) => {
              const tableRows = ticket.link.map((link, i) => {
                const href = `${window.location.origin}/claim/${
                  getConfig().contractId
                }#${link.replace('ed25519:', '')}`;
                const slug = link.substring(8, 16);

                return {
                  id: `${ticket.id}-${i}`,
                  dropId: ticket.id,
                  dropLink: href,
                  link: (
                    <Text color="gray.400" display="flex">
                      {window.location.hostname}/
                      <Text as="span" color="gray.800">
                        {slug}
                      </Text>
                    </Text>
                  ),
                  action: (
                    <Button
                      mr="1"
                      size="sm"
                      variant="icon"
                      onClick={() => {
                        share(href);
                        toast({
                          title: 'Copied!',
                          status: 'success',
                          duration: 1000,
                          isClosable: true,
                        });
                      }}
                    >
                      <CopyIcon />
                    </Button>
                  ),
                };
              });

              if (!ticketStatus[ticket.dropName]) return <></>;
              return (
                <VStack key={`${ticket.id}-${i}`}>
                  <Heading size="sm">{ticket.dropName}</Heading>
                  <DataTable
                    columns={[
                      {
                        id: 'title',
                        title: 'Link',
                        selector: (row) => row.link,
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
                    ]}
                    data={tableRows}
                    loading={false}
                    minW={{ base: 'inherit', md: '476px' }}
                    showColumns={false}
                  />
                </VStack>
              );
            })}
          {!ticketLoading && (
            <Button
              onClick={() => {
                navigate(`/events/${accountId}`);
              }}
            >
              Back to events
            </Button>
          )}
        </VStack>
      </Center>
    </Box>
  );
};

export default PendingPurchasePage;
