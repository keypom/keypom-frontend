import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image as ChakraImage,
  Skeleton,
  SkeletonText,
  Text,
  Badge,
  VStack,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { IconBox } from '@/components/IconBox';
import { type EventInterface } from '@/pages/Event';
import { type DataItem } from '@/components/Table/types';
import { PURCHASED_LOCAL_STORAGE_PREFIX } from '@/constants/common';

import { TicketIncrementer } from './TicketIncrementer';

interface TicketCardProps {
  onSubmit?: (ticket: any, ticketAmount: any) => Promise<void>;
  event: EventInterface | DataItem;
  loading: boolean;
  surroundingNavLink: boolean;
}

interface SurroundingLinkProps {
  children: React.ReactNode;
}

export const TicketCard = ({ event, loading, surroundingNavLink, onSubmit }: TicketCardProps) => {
  let nav = '../gallery/';
  if (event?.navurl != null && event?.navurl !== undefined) {
    nav = '../gallery/' + String(event.navurl);
  }

  const [amount, setAmount] = useState(1);
  const [numPurchased, setNumPurchased] = useState(0);
  let availableTickets = 0;
  let limitPerUser = 100000; // default to a high number

  let eventHasPassed = false;

  if (
    event?.dateForPastCheck !== undefined &&
    event?.dateForPastCheck != null &&
    event?.dateForPastCheck < new Date()
  ) {
    eventHasPassed = true;
  }

  if (eventHasPassed) {
    nav = '../gallery/';
  }

  if (
    event.maxTickets !== undefined &&
    event.maxTickets !== null &&
    event.soldTickets !== undefined &&
    event.soldTickets !== null &&
    event.limitPerUser !== undefined &&
    event.limitPerUser !== null &&
    typeof event.maxTickets === 'number' &&
    typeof event.soldTickets === 'number' &&
    typeof event.limitPerUser === 'number'
  ) {
    limitPerUser = event.limitPerUser;
    availableTickets = event.maxTickets - event.soldTickets;
  }

  let showLimit = true;
  if (limitPerUser > availableTickets) {
    showLimit = false;
  }
  if (limitPerUser == null || limitPerUser === undefined) {
    showLimit = false;
  }

  useEffect(() => {
    if (event?.id !== undefined) {
      const key = `${PURCHASED_LOCAL_STORAGE_PREFIX as string}_${event.id as string}`;
      const purchased = localStorage.getItem(key);
      if (purchased) {
        setNumPurchased(parseInt(purchased));
      }
    }
  }, [event.id]);

  const decrementAmount = () => {
    if (amount === 1) return;
    setAmount(amount - 1);
  };
  const incrementAmount = () => {
    if (availableTickets <= 0) return;

    if (amount >= availableTickets) return;

    if (
      event.numTickets !== undefined &&
      event.numTickets !== 'unlimited' &&
      typeof event.numTickets === 'number' &&
      amount >= event.numTickets
    )
      return;
    setAmount(amount + 1);
  };

  const SurroundingLink = ({ children }: SurroundingLinkProps) => {
    return surroundingNavLink ? (
      <Box height="100%">
        <NavLink to={nav}>{children}</NavLink>
      </Box>
    ) : (
      <Box height="100%">{children}</Box>
    );
  };

  const navButton = onSubmit == null;

  if (loading) {
    return (
      <IconBox
        key={event.id}
        h="full"
        maxW="340px"
        mt={{ base: '6', md: '7' }}
        pb={{ base: '6', md: '16' }}
      >
        <Card
          borderRadius={{ base: '1rem', md: '8xl' }}
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <CardHeader position="relative">
            <Skeleton
              bg="white"
              //   border="1px solid black"
              color="black"
              left="25"
              p={2}
              position="absolute"
              rounded="lg"
              top="25"
            ></Skeleton>
          </CardHeader>
          <CardBody color="black">
            <Skeleton as="h2" size="sm">
              {event.name}
            </Skeleton>
          </CardBody>
          <CardFooter>
            <Skeleton>
              <SkeletonText my="2px">Event loading</SkeletonText>
              <SkeletonText my="2px">Event loading</SkeletonText>
            </Skeleton>
          </CardFooter>
        </Card>
      </IconBox>
    );
  }
  let available = 0;
  if (typeof event?.maxTickets === 'number' && typeof event?.supply === 'number') {
    available = event?.maxTickets - event?.supply;
  }
  let alt = '';
  if (event?.name != null) {
    alt = String(event?.name);
  }
  let src = '';
  if (event?.media != null) {
    src = String(event?.media);
  }

  let multPrice = 0;
  if (typeof event.price === 'string' && event?.price != null && amount != null) {
    multPrice = parseFloat(event.price) * amount;
  }
  return (
    <IconBox
      key={event.id}
      _hover={eventHasPassed ? {} : { transform: 'scale(1.02)' }}
      borderRadius={{ base: '1rem', md: '6xl' }}
      h="full"
      m="0px"
      maxW="340px"
      p="0px"
      pb="0px"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        // border: '1px solid rgba(0, 0, 0, 0.5)',
      }}
      transition="transform 0.2s"
    >
      <SurroundingLink>
        <Box height="full" m="20px" position="relative">
          <ChakraImage
            alt={alt}
            border="0px"
            borderRadius="md"
            height="200px"
            objectFit="cover"
            src={src}
            width="100%"
          />

          {event.numTickets === 'unlimited' ? (
            <>
              <Badge
                borderRadius="full"
                color="grey"
                p={1}
                position="absolute"
                right="5"
                top="25"
                variant="gray"
                //   border="1px solid black"
              >
                ∞ of {event.numTickets} available
              </Badge>
            </>
          ) : (
            <>
              {event.numTickets === '0' ||
              event.maxTickets === undefined ||
              event.maxTickets == null ||
              event.supply == null ||
              event.supply === undefined ? (
                <>
                  <Badge
                    borderRadius="full"
                    color="grey"
                    fontSize="2xs"
                    p={1}
                    position="absolute"
                    right="3"
                    top="15"
                    variant="gray"
                  >
                    Sold out
                  </Badge>
                </>
              ) : (
                <Badge
                  borderRadius="full"
                  color="grey"
                  fontSize="2xs"
                  p={1}
                  position="absolute"
                  right="3"
                  top="15"
                  variant="gray"
                >
                  {available} of {event.maxTickets} available
                </Badge>
              )}
            </>
          )}

          <Box color="black">
            <Text
              align="left"
              as="h2"
              color="black.800"
              fontSize="xl"
              fontWeight="medium"
              mt="3"
              size="sm"
            >
              {event.name}
            </Text>
          </Box>
          <Box>
            <Text align="left" color="gray.400" fontSize="xs" mt="2px">
              {event.dateString}
            </Text>
            <Text align="left" color="gray.400" fontSize="sm">
              {event.location}
            </Text>
            <Text align="left" color="black" fontSize="sm" mt="5px">
              {event.description}
            </Text>
          </Box>
          {!navButton && amount && event.numTickets !== '0' && event.numTickets !== '1' ? (
            <VStack align="left" spacing="0" textAlign="left" w="full">
              <TicketIncrementer
                amount={amount}
                decrementAmount={decrementAmount}
                incrementAmount={incrementAmount}
                maxAmount={Math.min(limitPerUser - numPurchased, availableTickets)}
              />
              {showLimit && (
                <Text color="gray.400" fontSize="sm" fontWeight="400">
                  {`Limit of ${limitPerUser} per customer${
                    numPurchased > 0 ? ` (${numPurchased} owned)` : ''
                  }`}
                </Text>
              )}
            </VStack>
          ) : null}
          {navButton ? (
            <>
              <Box h="14"></Box>
              <NavLink to={nav}>
                <Box flexGrow={1} />
                <Button
                  bottom="35"
                  isDisabled={eventHasPassed}
                  left="0"
                  mt="2"
                  position="absolute"
                  w="100%"
                >
                  {eventHasPassed ? 'Event Over' : 'Browse Event'}
                </Button>
              </NavLink>
            </>
          ) : (
            <>
              <Box h="14"></Box>
              <Button
                bottom="35"
                isDisabled={event.numTickets === '0'}
                left="0"
                mt="2"
                position="absolute"
                w="100%"
                onClick={() => {
                  onSubmit(event, amount);
                }}
              >
                {event.numTickets === '0' ||
                event.maxTickets === undefined ||
                event.supply === undefined ||
                event.price === undefined ? (
                  <> Sold Out </>
                ) : (
                  <> {multPrice === 0 ? `Get for free` : `Buy for ${multPrice} NEAR`} </>
                )}
              </Button>
            </>
          )}
        </Box>
      </SurroundingLink>
    </IconBox>
  );
};
