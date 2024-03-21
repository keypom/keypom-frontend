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
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

import { IconBox } from '@/components/IconBox';

import { TicketIncrementer } from './TicketIncrementer';

interface TicketCardProps {
  input: string;
  setInput: (input: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  event: object;
  loading: boolean;
  surroundingNavLink: boolean;
}

interface SurroundingLinkProps {
  children: React.ReactNode;
}

export const TicketCard = ({ event, loading, surroundingNavLink, onSubmit }: TicketCardProps) => {
  let nav = '../gallery/';
  if (event?.navurl) {
    nav = '../gallery/' + String(event.navurl);
  }

  const [amount, setAmount] = useState(1);

  const decrementAmount = () => {
    if (amount === 1) return;
    setAmount(amount - 1);
  };
  const incrementAmount = (e) => {
    const availableTickets = event.maxTickets - event.soldTickets;
    if (availableTickets <= 0) return;

    if (amount >= availableTickets) return;

    if (event.numTickets !== 'unlimited' && amount >= event.numTickets) return;
    setAmount(amount + 1);
  };

  const SurroundingLink = ({ children }: SurroundingLinkProps) => {
    return surroundingNavLink ? (
      <NavLink height="100%" to={nav}>
        {children}
      </NavLink>
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
            <Skeleton align="start" spacing={2}>
              <SkeletonText my="2px">Event on {event.type}</SkeletonText>
              <SkeletonText my="2px">Event in {event.id}</SkeletonText>
            </Skeleton>
          </CardFooter>
        </Card>
      </IconBox>
    );
  }
  return (
    <IconBox
      key={event.id}
      _hover={{ transform: 'scale(1.02)' }}
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
            alt={event.name}
            border="0px"
            borderRadius="md"
            height="200px"
            objectFit="cover"
            src={event.media}
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
              {event.numTickets === '0' ? (
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
                  {event.maxTickets - event.supply} of {event.maxTickets} available
                </Badge>
              )}
            </>
          )}

          <Box align="left" color="black">
            <Text as="h2" color="black.800" fontSize="xl" fontWeight="medium" mt="3" size="sm">
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
              {/* sdfkal j udasfljkhdh ijoadsijkou rfhadijkls fjklhadshijklf asdhjklfh klajdshf
              oikadshfklj hadskljf halksdjhfl jkh */}
            </Text>
          </Box>
          {!navButton && amount && event.numTickets !== '0' && event.numTickets !== '1' ? (
            <TicketIncrementer
              amount={amount}
              decrementAmount={decrementAmount}
              incrementAmount={incrementAmount}
            />
          ) : null}
          {navButton ? (
            <>
              <Box h="14"></Box>
              <NavLink display="flex" flexDirection="column" height="100%" to={nav}>
                <Box flexGrow={1} />
                <Button bottom="35" left="0" mt="2" position="absolute" w="100%">
                  {' '}
                  Browse Event
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
                Buy for {event.price * amount} NEAR
              </Button>
            </>
          )}
        </Box>
      </SurroundingLink>
    </IconBox>
  );
};
