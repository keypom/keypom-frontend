import { IconBox } from '@/components/IconBox';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Image as ChakraImage,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  SkeletonText,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Form, NavLink } from 'react-router-dom';

interface PurchaseModalProps {
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

export const TicketCard = ({
  event,
  loading,
  amount,
  incrementAmount,
  decrementAmount,
  surroundingNavLink,
  onSubmit,
}: PurchaseModalProps) => {
  const SurroundingLink = ({ children }) => {
    return surroundingNavLink ? (
      <NavLink to={'../gallery/' + String(event.id)}>{children}</NavLink>
    ) : (
      <>{children}</>
    );
  };

  const navButton = onSubmit == null ? true : false;

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
      transition="transform 0.2s"
      _hover={{ transform: 'scale(1.05)' }}
      borderRadius={{ base: '1rem', md: '8xl' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        // border: '1px solid rgba(0, 0, 0, 0.5)',
      }}
      p="0px"
      m="0px"
    >
      <SurroundingLink>
        <Box m="30px" position="relative">
          <ChakraImage
            alt={event.name}
            borderRadius="md"
            height="300px"
            objectFit="cover"
            src={'te'}
            width="100%"
            border="0px"
          />
          <Box
            bg="white"
            //   border="1px solid black"
            color="grey"
            right="5"
            p={2}
            position="absolute"
            rounded="lg"
            top="25"
          >
            {event.claimed} available
          </Box>

          <Box align="left" color="black">
            <Heading as="h2" size="md">
              {event.name}
            </Heading>
          </Box>
          <Box>
            <VStack align="start" spacing={2}>
              <Text color="grey" my="2px">
                {event.type}
              </Text>
              <Text align="left" color="black" my="2px">
                {event.id} Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud exercitation ullamco laboris nisi ut aliq
              </Text>
            </VStack>
          </Box>
          {amount ? (
            <>
              <HStack mt="5">
                <Button w="7px" variant="secondary" onClick={decrementAmount}>
                  -
                </Button>
                <Button w="7px" variant="secondary">
                  {amount}
                </Button>
                <Button w="7px" variant="secondary" onClick={incrementAmount}>
                  +
                </Button>
              </HStack>
            </>
          ) : null}
          {navButton ? (
            <>
              <NavLink to={'../gallery/' + String(event.id)}>
                <Button w="100%" mt="5">
                  {' '}
                  Buy for {event.claimed} NEAR
                </Button>
              </NavLink>
            </>
          ) : (
            <>
              <Button w="100%" mt="5" onClick={onSubmit}>
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
