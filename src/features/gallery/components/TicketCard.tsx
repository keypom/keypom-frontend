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
  VStack,
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
  amount: number;
  incrementAmount: () => void;
  decrementAmount: () => void;
  surroundingNavLink: boolean;
}

interface SurroundingLinkProps {
  children: React.ReactNode;
}

export const TicketCard = ({
  event,
  loading,
  amount,
  incrementAmount,
  decrementAmount,
  surroundingNavLink,
  onSubmit,
}: TicketCardProps) => {
  const SurroundingLink = ({ children }: SurroundingLinkProps) => {
    return surroundingNavLink ? (
      <NavLink to={'../gallery/' + String(event.id)}>{children}</NavLink>
    ) : (
      <>{children}</>
    );
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
      _hover={{ transform: 'scale(1.05)' }}
      borderRadius={{ base: '1rem', md: '8xl' }}
      m="0px"
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
        <Box m="30px" position="relative">
          <ChakraImage
            alt={event.name}
            border="0px"
            borderRadius="md"
            height="200px"
            objectFit="cover"
            src={'te'}
            width="100%"
          />
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
            {event.claimed} available
          </Badge>

          <Box align="left" color="black">
            <Text as="h2" color="black.800" fontSize="xl" fontWeight="medium" my="2" size="sm">
              {event.name}
            </Text>
          </Box>
          <Box>
            <VStack align="start" spacing={2}>
              <Text color="grey" fontSize="sm" my="1px">
                {event.type}
              </Text>
              <Text color="grey" fontSize="sm" my="1px">
                {event.id}
              </Text>

              <Text align="left" color="black" fontSize="sm" my="1px">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliq
              </Text>
            </VStack>
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
              <NavLink to={'../gallery/' + String(event.id)}>
                <Button mt="5" w="100%">
                  {' '}
                  Browse Event
                </Button>
              </NavLink>
            </>
          ) : (
            <>
              <Button mt="5" w="100%" onClick={onSubmit}>
                {' '}
                Buy for {event.claimed} NEAR
              </Button>
            </>
          )}
        </Box>
      </SurroundingLink>
    </IconBox>
  );
};
