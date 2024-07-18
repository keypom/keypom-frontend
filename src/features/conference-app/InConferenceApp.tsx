import { Box, Flex, HStack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { conferenceFooterMenuItems, useConferenceContext } from '@/contexts/ConferenceContext';

const selectedColor = 'black';
const unselectedColor = 'white';

const InConferenceApp = () => {
  const { eventInfo, selectedTab, onSelectTab, queryString } = useConferenceContext();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`${conferenceFooterMenuItems[selectedTab].path}?${queryString.toString()}`, {
      replace: true,
    });
  }, [selectedTab, queryString, navigate]);

  const currentTab = () => {
    const Component = conferenceFooterMenuItems[selectedTab].component;
    return <Component />;
  };

  return (
    <Flex
      backgroundImage={`assets/demos/consensus/background.png`}
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      direction="column"
      h="95vh"
      width="100vw"
    >
      <Box flex="1" overflowY="hidden">
        {currentTab()}
      </Box>
      <HStack
        as="footer"
        backgroundColor="event.h1"
        bottom="0"
        boxShadow="0 -2px 10px rgba(0,0,0,0.05)"
        h="8vh"
        justifyContent="space-evenly"
        left="0"
        paddingY="2"
        position="fixed"
        width="full"
        zIndex="1000" // Ensure footer stays above other content
      >
        {conferenceFooterMenuItems.map((item, index) => {
          const IconComponent = item.icon;
          const isActive = index === selectedTab;
          return (
            <Flex
              key={index}
              align="center"
              direction="column"
              onClick={() => {
                onSelectTab(index);
              }}
            >
              <Box as="button" paddingX="2" paddingY="1">
                <IconComponent
                  color={isActive ? selectedColor : unselectedColor}
                  h="40px"
                  strokeWidth="1"
                  w="40px"
                />
              </Box>
            </Flex>
          );
        })}
      </HStack>
    </Flex>
  );
};

export default InConferenceApp;
