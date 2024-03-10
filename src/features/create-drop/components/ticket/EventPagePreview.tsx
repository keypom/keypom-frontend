import { Box, VStack, Image, Heading, HStack } from '@chakra-ui/react';

interface EventPagePreviewProps {
  eventName: string;
  eventDescription?: string;
  eventLocation?: string;
  eventDate: string;
  eventArtwork?: string;
}

function EventPagePreview({
  eventName,
  eventDescription,
  eventLocation,
  eventDate,
  eventArtwork,
}: EventPagePreviewProps) {
  return (
    <VStack align="start" paddingTop={5} position="relative" w="50%">
      {' '}
      {/* Adjust height as needed */}
      <Box
        alignSelf="stretch"
        bgGradient="linear(to right, rgba(255, 255, 255, 0), rgba(115, 214, 243, 0.2))"
        height="120px"
        left="0"
        right="0"
        top="0"
        width="100%"
        zIndex={eventArtwork ? 1 : 'auto'} // If there's an image, it should be below the image layer
      />
      {eventArtwork && (
        <Image
          alt="Event Artwork"
          height="500px"
          left="0"
          objectFit="cover" // This ensures the image covers the allotted area
          position="absolute" // Position the image absolutely within the VStack
          right="0"
          src={eventArtwork}
          top="0"
          width="100%"
          zIndex={2} // The zIndex ensures the image is above the gradient layer
        />
      )}
      <VStack alignItems="left" px={16} spacing={4} w="100%">
        <Heading
          color="gray.600"
          fontSize="lg"
          fontWeight="700"
          paddingBottom={1}
          paddingTop={3}
          textAlign="left"
        >
          {eventName || 'Event name'}
        </Heading>
        <HStack align="top" spacing={4} w="100%">
          <VStack align="start" w="60%">
            <Heading color="gray.600" fontFamily="body" fontSize="2xs" fontWeight="700">
              Event details
            </Heading>
            {eventDescription ? (
              // Assuming you want to display the event description when it exists
              <Heading color="gray.600" fontFamily="body" fontSize="2xs" fontWeight="400">
                {eventDescription}
              </Heading>
            ) : (
              // Placeholder pills when there is no event description
              <VStack align="start" h="full" spacing="11px" w="full">
                {Array.from({ length: 5 }, (_, index) => (
                  <Box key={index} bg="gray.100" borderRadius="100px" h="10px" w="full" />
                ))}
                <Box bg="gray.100" borderRadius="100px" h="10px" w="50%" />
              </VStack>
            )}
          </VStack>
          <VStack align="start" spacing={6} w="40%">
            <VStack align="start" w="100%">
              <Heading color="gray.600" fontFamily="body" fontSize="2xs" fontWeight="700">
                Location
              </Heading>
              {eventLocation ? (
                // Assuming you want to display the event description when it exists
                <Heading color="gray.600" fontFamily="body" fontSize="2xs" fontWeight="400">
                  {eventLocation}
                </Heading>
              ) : (
                <Box bg="gray.100" borderRadius="100px" h="10px" w="full" />
              )}
            </VStack>
            <VStack align="start" w="100%">
              <Heading color="gray.600" fontFamily="body" fontSize="2xs" fontWeight="700">
                Date
              </Heading>
              {eventDate ? (
                // Assuming you want to display the event description when it exists
                <Heading color="gray.600" fontFamily="body" fontSize="2xs" fontWeight="400">
                  {eventDate}
                </Heading>
              ) : (
                <Box bg="gray.100" borderRadius="100px" h="10px" w="full" />
              )}
            </VStack>
          </VStack>
        </HStack>
      </VStack>
      <Heading
        color="gray.600"
        fontSize="lg"
        fontWeight="700"
        paddingBottom={1}
        paddingLeft={16}
        paddingTop={3}
      >
        Tickets
      </Heading>
    </VStack>
  );
}

export default EventPagePreview;
