import { Button, Heading, HStack, IconButton, Image, VStack, Box } from '@chakra-ui/react';

import { PlusButtonIcon } from '@/components/Icons/PlusButtonIcon';
import { MinusButtonIcon } from '@/components/Icons/MinusButtonIcon';
import { dateAndTimeToText } from '@/features/drop-manager/utils/parseDates';

import { type TicketInfoFormMetadata } from './CreateTicketsForm';

export const DynamicTicketPreview = ({
  currentTicket,
}: {
  currentTicket: TicketInfoFormMetadata;
}) => {
  const placeholderColor = 'gray.200'; // Define your placeholder color here

  return (
    <VStack align="stretch" spacing={6} w="full">
      <VStack
        align="stretch"
        bg="border.box"
        border="2px solid transparent"
        borderRadius="7xl"
        borderWidth="2px"
        overflow="hidden"
        p={6}
      >
        {currentTicket.artwork ? (
          <Image
            alt="Event Artwork"
            borderRadius="5xl"
            height="200px"
            objectFit="cover"
            src={URL.createObjectURL(currentTicket.artwork)}
            width="100%"
          />
        ) : (
          <Box bg={placeholderColor} borderRadius="xl" height="200px" />
        )}
        <VStack align="left" spacing={2} textAlign="left">
          {currentTicket.name ? (
            <Heading color="gray.900" fontSize="2xl" fontWeight="500">
              {currentTicket.name}
            </Heading>
          ) : (
            <Box bg={placeholderColor} borderRadius="xl" height="20px" width="60%" />
          )}
          {currentTicket.passValidThrough.startDate ? (
            <Heading color="gray.400" fontFamily="body" fontSize="xs" fontWeight="400">
              {dateAndTimeToText(currentTicket.passValidThrough)}
            </Heading>
          ) : (
            <Box bg={placeholderColor} borderRadius="xl" height="10px" width="30%" />
          )}
          {currentTicket.description ? (
            <Heading color="gray.600" fontFamily="body" fontSize="xs" fontWeight="400">
              {currentTicket.description}
            </Heading>
          ) : (
            <VStack align="left" py="2" spacing={1}>
              <Box bg={placeholderColor} borderRadius="xl" height="10px" width="100%" />
              <Box bg={placeholderColor} borderRadius="xl" height="10px" width="100%" />
              <Box bg={placeholderColor} borderRadius="xl" height="10px" width="100%" />
              <Box bg={placeholderColor} borderRadius="xl" height="10px" width="60%" />
            </VStack>
          )}
        </VStack>
        <HStack marginTop="5 !important">
          <IconButton
            isDisabled
            aria-label="plus-button-icon"
            icon={<MinusButtonIcon color="gray.600" h="3px" w="10px" />} // replace with your actual icon
            variant="outline"
          />
          <Button
            isDisabled
            border="1px solid transparent"
            borderColor="gray.200"
            borderRadius="6xl"
            color="gray.600"
            h="40px"
            variant="secondary"
            w="30px"
          >
            1
          </Button>
          <IconButton
            isDisabled
            aria-label="plus-button-icon"
            icon={<PlusButtonIcon h="28px" />} // replace with your actual icon
            variant="outline"
          />
        </HStack>

        <Button borderRadius="6xl" marginTop="5 !important" variant="primary" w="full">
          {currentTicket.priceNear === '0'
            ? `Get for free`
            : `Buy for ${currentTicket.priceNear} NEAR`}
        </Button>
      </VStack>
    </VStack>
  );
};
