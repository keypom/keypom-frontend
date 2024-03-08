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

import { IconBox } from '@/components/IconBox';

import { TicketIncrementer } from './TicketIncrementer';

interface TicketCardProps {
  input: string;
  setInput: (input: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  event: any;
  loading: boolean;
  amount: [];
  incrementAmount: () => void;
  decrementAmount: () => void;
  surroundingNavLink: boolean;
  cardArrayIndex: number;
  changeTicketAmount: (amount: []) => void;
}

interface SurroundingLinkProps {
  children: React.ReactNode;
}

export const TicketCard = ({
  event,
  loading,
  amount,
  changeTicketAmount,
  surroundingNavLink,
  onSubmit,
  cardArrayIndex,
}: TicketCardProps) => {
  const nav = '../gallery/' + String(event.navurl);

  const SurroundingLink = ({ children }: SurroundingLinkProps) => {
    return surroundingNavLink ? <NavLink to={nav}>{children}</NavLink> : <>{children}</>;
  };

  const decrementAmount = (e) => {
    e.preventDefault();
    // change amount at index to be one less
    if (amount[cardArrayIndex] <= 0) return;
    changeTicketAmount((prevAmount) => {
      // Create a new array from the previous amount
      const newAmount = [...prevAmount];
      newAmount[cardArrayIndex]--;
      return newAmount;
    });
  };
  const incrementAmount = (e) => {
    e.preventDefault();
    // change amount at index to be one more
    // if (
    //   event.numTickets !== 'unlimited' &&
    //   event.numTickets !== '0' &&
    //   amount[cardArrayIndex] >= event.numTickets
    // )
    //   return;
    changeTicketAmount((prevAmount) => {
      // Create a new array from the previous amount
      const newAmount = [...prevAmount];
      newAmount[cardArrayIndex]++;
      return newAmount;
    });
  };

  const navButton = onSubmit == null;

  if (loading) {
    return (
      <IconBox
        key={event.id}
        h="full"
        mt={{ base: '6', md: '7' }}
        pb={{ base: '6', md: '16' }}
        w="full"
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
      m="0px"
      maxW="320px"
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
        <Box m="20px" position="relative">
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
            <></>
          ) : (
            <>
              {event.numTickets === '0' ? (
                <>
                  <Badge
                    p={2}
                    position="absolute"
                    right="5"
                    rounded="lg"
                    top="25"
                    variant="gray"
                    //   border="1px solid black"
                    color="grey"
                  >
                    Sold out
                  </Badge>
                </>
              ) : (
                <Badge
                  borderRadius="full"
                  color="grey"
                  fontSize="2xs"
                  p={0.5}
                  position="absolute"
                  right="3"
                  rounded="lg"
                  top="15"
                  variant="gray"
                >
                  {event.numTickets} of {event.numTickets} available
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
            </Text>
          </Box>
          {amount ? (
            <TicketIncrementer
              amount={amount}
              decrementAmount={decrementAmount}
              incrementAmount={incrementAmount}
            />
          ) : null}
          {navButton ? (
            <>
              <NavLink to={nav}>
                <Button mt="2" w="100%">
                  {' '}
                  Browse Event
                </Button>
              </NavLink>
            </>
          ) : (
            <>
              <Button mt="5" w="100%" onClick={onSubmit}>
                {' '}
                Buy for {event.price} NEAR
              </Button>
            </>
          )}
        </Box>
      </SurroundingLink>
    </IconBox>
  );
};
