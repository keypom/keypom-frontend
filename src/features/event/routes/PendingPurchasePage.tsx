import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Link,
  Spinner,
  Text,
  useBoolean,
  VStack,
} from '@chakra-ui/react';
import { addKeys } from 'keypom-js';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CheckCircleIcon } from '@chakra-ui/icons';

import { BoxWithShape } from '@/components/BoxWithShape';
import { IconBox } from '@/components/IconBox';
import { del, get } from '@/utils/localStorage';
import { PENDING_TICKET_PURCHASE } from '@/constants/common';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import keypomInstance from '@/lib/keypom';
import getConfig from '@/config/config';

const PendingPurchasePage = () => {
  const { publicKeys, dropIds } = get(PENDING_TICKET_PURCHASE) || '{}';

  const [cart, setCart] = useState([]);
  const [ticketStatus, setTicketStatus] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useBoolean(true);

  const navigate = useNavigate();
  const { selector, accountId } = useAuthWalletContext();

  const getDropName = async (dropId: string) => {
    const drop = await keypomInstance.getDropInfo({ dropId });
    const { dropName } = keypomInstance.getDropMetadata(drop.metadata);

    return dropName;
  };

  const getTicketDetails = async () => {
    const ticketDetails = await Promise.all(
      publicKeys.map(async (_, i) => {
        return {
          dropName: await getDropName(dropIds[i]),
          link: publicKeys[i],
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
        await addKeys({
          wallet: await selector.wallet(),
          publicKeys: publicKeys[i],
          dropId: dropIds[i],
          numKeys: publicKeys[i].length,
          useBalance: true,
        });

        const dropName = await getDropName(dropIds[i]);
        setTicketStatus((statuses) => ({ ...statuses, [dropName]: true }));
      }),
    )
      .catch(console.error)
      .finally(() => {
        console.log('deleting local storage cart');
        // del(PENDING_TICKET_PURCHASE);
      });
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
            <BoxWithShape
              bg="white"
              borderTopRadius="8xl"
              pb={{ base: '6', md: '8' }}
              pt={{ base: '6', md: '8' }}
              px={{ base: '6', md: '8' }}
              shapeSize="md"
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
            </BoxWithShape>
            <VStack
              bg="gray.50"
              borderBottomRadius="8xl"
              p="8"
              spacing={{ base: '4', md: '5' }}
              w="full"
            >
              <>
                <VStack spacing="4">
                  {cart.map((ticket, i) => (
                    <VStack key={i} spacing="2">
                      {ticket.link.map((link, i) => {
                        const href = `${window.location.origin}/claim/${
                          getConfig().contractId
                        }#${link.replace('ed25519:', '')}`;
                        const slug = link.substring(8, 16);

                        return (
                          <Link key={i} href={href}>
                            <Text>{slug}</Text>
                          </Link>
                        );
                      })}
                    </VStack>
                  ))}
                </VStack>
                <Button
                  onClick={() => {
                    del(PENDING_TICKET_PURCHASE);
                    navigate(`/events/${accountId}`);
                  }}
                >
                  Back to events
                </Button>
              </>
            </VStack>
          </IconBox>
        </VStack>
      </Center>
    </Box>
  );
};

export default PendingPurchasePage;
