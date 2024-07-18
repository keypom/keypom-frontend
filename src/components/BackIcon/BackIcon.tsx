import { Box, Flex, Text } from '@chakra-ui/react';

import { type FunderEventMetadata } from '@/lib/eventsHelpers';
import { conferenceFooterMenuIndexes } from '@/contexts/ConferenceContext';

const CustomArrowIcon = ({ color = 'black', size = 20 }: { color?: string; size?: number }) => (
  <svg
    fill="none"
    height={size}
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    style={{ display: 'block' }}
    viewBox="0 0 24 24"
    width={size}
  >
    <path d="M12 19l-7-7 7-7" />
  </svg>
);

export const BackIcon = ({
  onSelectTab,
  eventInfo,
}: {
  onSelectTab: (index: number, tab: string) => void;
  eventInfo: FunderEventMetadata;
}) => {
  return (
    <Box
      bg="white"
      borderTopLeftRadius="24"
      borderTopRightRadius="24"
      position="absolute"
      w="100%"
      zIndex="1"
    >
      <Flex
        align="center"
        as="button"
        borderRadius="md"
        justify="center"
        p="2"
        pt="2"
        w={{ base: '80px', md: '100px' }}
        onClick={() => {
          onSelectTab(conferenceFooterMenuIndexes.assets, 'home');
        }}
      >
        <CustomArrowIcon color="black" size={16} />
        <Text
          color="event.h3"
          fontFamily="heading"
          fontSize="md"
          fontWeight="600"
          ml="0"
          mt="0.5"
        >
          Back
        </Text>
      </Flex>
    </Box>
  );
};
