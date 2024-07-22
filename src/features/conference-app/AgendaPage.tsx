import {
  Box,
  Center,
  Flex,
  VStack,
  HStack,
  Skeleton,
  Input,
  IconButton,
  ButtonGroup,
  Image,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { SearchIcon } from '@chakra-ui/icons';
import { FaThList, FaTh } from 'react-icons/fa';

import { useConferenceContext } from '@/contexts/ConferenceContext';
import { IconBox } from '@/components/IconBox';
import { BoxWithShape } from '@/components/BoxWithShape';
import GroupedAgendaItems from '@/components/AgendaItem/GroupedAgendaItems';
import AgendaItemCard from '@/components/AgendaItem/AgendaItemCard';

export interface Speaker {
  name: string;
  image: string;
  title?: string;
  company?: string;
}

export interface AgendaItem {
  title: string;
  location: string;
  building: string;
  color: string;
  time: string;
  date: string;
  duration: string;
  description: string;
  format?: string;
  speakers?: Speaker[];
  presentedBy?: string;
  track?: string;
}

// Dummy data moved outside
const dummyAgendaData: AgendaItem[] = [
  {
    date: 'Wednesday, May 29',
    time: '9:00 AM',
    duration: '50 mins',
    title: 'RWAs & Tokenization - Evolution or Revolution in Traditional Finance?',
    location: 'ACC: Spotlight Stage',
    building: 'Building A',
    description:
      'Join us for an insightful discussion as we dive into the world of RWA tokenization. Explore the potential benefits, challenges, and opportunities associated with RWA tokenization, and its role in transforming various traditional financial markets.',
    color: 'red.100',
    format: 'Ceremony',
    speakers: [
      {
        name: 'Carlos Domingo',
        image:
          'https://d2pasa6bkzkrjd.cloudfront.net/_resize/consensus2024/speaker/300/site/consensus2024/images/userfiles/speakers/766129b4736cae5d8287e2ba4802cd1c.jpg',
        title: 'Co-Founder and CEO',
        company: 'Securitize',
      },
      {
        name: 'Adam Lawrence',
        image:
          'https://d2pasa6bkzkrjd.cloudfront.net/_resize/consensus2024/speaker/300/site/consensus2024/images/userfiles/speakers/b275a6942bb346bde978b75400ebc34d.jpg',
        title: 'CEO and Co-Founder',
        company: 'RWA.xyz',
      },
      {
        name: 'John Patrick Mullin',
        image:
          'https://d2pasa6bkzkrjd.cloudfront.net/_resize/consensus2024/speaker/300/site/consensus2024/images/userfiles/speakers/5deda7c6cbc11e65cae2c5b7bc30c63b.jpg',
        title: 'CEO and Co-Founder',
        company: 'MANTRA',
      },
    ],
    presentedBy: 'Conference Org',
    track: 'Sponsored Sessions',
  },
  {
    date: 'Wednesday, May 29',
    time: '9:00 AM',
    duration: '10 mins',
    title: 'Welcome to Consensus 2025',
    location: 'ACC: Mainstage',
    building: 'Building A',
    description:
      'Join us for an insightful discussion as we dive into the world of RWA tokenization. Explore the potential benefits, challenges, and opportunities associated with RWA tokenization, and its role in transforming various traditional financial markets.',
    color: 'blue.100',
    format: 'Ceremony',
    speakers: [
      {
        name: 'Michael Casey',
        image:
          'https://d2pasa6bkzkrjd.cloudfront.net/_resize/consensus2024/speaker/300/site/consensus2024/images/userfiles/speakers/ed5f04da8a640fa30b2976a1166097e2.jpg',
        title: 'Chain, Consensus 2025',
        company: 'CoinDesk',
      },
    ],
  },
  {
    date: 'Wednesday, May 29',
    time: '10:00 AM',
    duration: '05 mins',
    title: 'Welcome',
    location: 'ACC: Gen C Stage',
    building: 'Building A',
    description:
      'Join us for an insightful discussion as we dive into the world of RWA tokenization. Explore the potential benefits, challenges, and opportunities associated with RWA tokenization, and its role in transforming various traditional financial markets.',
    color: 'red.100',
    format: 'Ceremony',
    speakers: [
      {
        name: 'Sam Ewen',
        image:
          'https://d2pasa6bkzkrjd.cloudfront.net/_resize/consensus2024/speaker/300/site/consensus2024/images/userfiles/speakers/9e4e6206a5e8ceb0a6e9561594961a83.jpg',
        title: 'SVP',
        company: 'CoinDesk',
      },
    ],
    presentedBy: 'Conference Org',
  },
  {
    date: 'Wednesday, May 29',
    time: '10:05 AM',
    duration: '30 mins',
    title: 'How Brands Use Web3 to Reach New Luxury Consumers',
    location: 'ACC: Gen C Stage',
    building: 'Building A',
    description:
      'Join us for an insightful discussion as we dive into the world of RWA tokenization. Explore the potential benefits, challenges, and opportunities associated with RWA tokenization, and its role in transforming various traditional financial markets.',
    color: 'blue.100',
    format: 'Ceremony',
    speakers: [
      {
        name: 'Vanessa Grellet',
        image:
          'https://d2pasa6bkzkrjd.cloudfront.net/_resize/consensus2024/speaker/300/site/consensus2024/images/userfiles/speakers/70eae8a53338307bf6e0c2a1e4713815.jpg',
        title: 'Managing Partner',
        company: 'Arche Capital',
      },
      {
        name: 'Erika Wykes-Sneyd',
        image:
          'https://d2pasa6bkzkrjd.cloudfront.net/_resize/consensus2024/speaker/300/site/consensus2024/images/userfiles/speakers/69319e3fe587ffcedcff4a9318eddf4e.jpg',
        title: 'Vice President of adidas /// Studio',
        company: 'adidas',
      },
      {
        name: 'Dani Mariano',
        image:
          'https://d2pasa6bkzkrjd.cloudfront.net/_resize/consensus2024/speaker/300/site/consensus2024/images/userfiles/speakers/886ecce4917c9bb875824184ca8a9979.jpg',
        title: 'President',
        company: 'Razorfish',
      },
      {
        name: 'Camilla McFarland',
        image:
          'https://d2pasa6bkzkrjd.cloudfront.net/_resize/consensus2024/speaker/300/site/consensus2024/images/userfiles/speakers/863fbbc9d36b475a4ee528e569c4b3b8.jpg',
        title: 'Advisor',
        company: 'Serotonin',
      },
    ],
    presentedBy: 'Conference Org',
    track: 'Web3, Brand',
  },
];

const getDummyAgendaForDate = (date: Date): AgendaItem[] => {
  // Here you can filter based on the date if necessary
  return dummyAgendaData;
};

const AgendaPage: React.FC = () => {
  const { eventInfo, isLoading } = useConferenceContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dummyAgenda, setDummyAgenda] = useState<AgendaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewOption, setViewOption] = useState('list');

  useEffect(() => {
    setDummyAgenda(getDummyAgendaForDate(currentDate));
  }, [currentDate]);

  const filterAgendaItems = (items: AgendaItem[], query: string): AgendaItem[] => {
    if (!query) {
      return items;
    }
    const lowercasedQuery = query.toLowerCase();
    return items.filter((item) => {
      return (
        item.title.toLowerCase().includes(lowercasedQuery) ||
        item.description.toLowerCase().includes(lowercasedQuery) ||
        item.location.toLowerCase().includes(lowercasedQuery) ||
        item.speakers?.some((speaker) => speaker.name.toLowerCase().includes(lowercasedQuery))
      );
    });
  };

  const filteredAgenda = filterAgendaItems(dummyAgenda, searchQuery);

  const renderAgendaItems = () => {
    return filteredAgenda.map((item, index) => <AgendaItemCard key={index} item={item} />);
  };

  const renderGroupedAgendaItems = () => {
    const groupedAgenda = filteredAgenda.reduce<Record<string, AgendaItem[]>>((groups, item) => {
      const time = item.time;
      if (!groups[time]) {
        groups[time] = [];
      }
      groups[time].push(item);
      return groups;
    }, {});

    return <GroupedAgendaItems groupedAgenda={groupedAgenda} />;
  };

  return (
    <Center h="90vh">
      <VStack
        gap={{ base: '16px', md: '24px', lg: '32px' }}
        overflowY="auto"
        pt="14"
        spacing="4"
        w={{ base: '90vw', md: '90%', lg: '80%' }}
      >
        <IconBox
          bg='border.box'
          h="full"
          icon={
            <Skeleton isLoaded={!isLoading}>
              <Image
                borderRadius="full"
                height={{ base: '14', md: '12' }}
                src={`/assets/demos/consensus/consensus_logo.png`}
                width={{ base: '20', md: '12' }}
              />
            </Skeleton>
          }
          iconBg={'event.iconBg'}
          iconBorder={'event.iconBorder'}
          minW={{ base: '90vw', md: '345px' }}
          p="0"
          pb="0"
          w="full"
        >
          <Box>
            <BoxWithShape bg="white" borderTopRadius="8xl" showNotch={false} w="full">
              {isLoading ? (
                <Skeleton height="200px" width="full" />
              ) : (
                <Flex
                  align="center"
                  flexDir="column"
                  pb={{ base: '2', md: '5' }}
                  pt={{ base: '10', md: '16' }}
                  px={{ base: '10', md: '8' }}
                >
                  <HStack borderBottom="2px solid" borderColor="gray.400" w="full">
                    <SearchIcon color="gray.500" />
                    <Input
                      _placeholder={{
                        color: 'event.h3',
                        fontFamily: 'heading',
                        fontSize: 'md',
                        fontWeight: '400',
                      }}
                      color='event.h3'
                      fontFamily='heading'
                      fontSize="md"
                      fontWeight='400'
                      h="30px"
                      placeholder="Search Agenda"
                      value={searchQuery}
                      variant="unstyled"
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                      }}
                    />
                  </HStack>
                </Flex>
              )}
            </BoxWithShape>

            <Flex
              flexDir="column"
              h="calc(90vh - 170px)"
              justifyContent="space-between"
              px="6"
              py="4"
              w="full"
            >
              <VStack h="full" overflowY="auto" w="full">
                <VStack w="100%">
                  <HStack alignItems="center" justifyContent="flex-end" mb={0} w="full">
                    <ButtonGroup isAttached spacing={0} variant="outline">
                      <IconButton
                        _active={{ bg: 'event.button.secondary.bg' }}
                        _focus={{ bg: 'event.button.secondary.bg' }}
                        _hover={{ bg: 'event.button.secondary.bg' }}
                        aria-label="List view"
                        bg='event.button.secondary.bg'
                        borderRadius="8px"
                        color={viewOption === 'list' ? 'black' : 'gray.400'}
                        icon={<FaThList />}
                        onClick={() => {
                          setViewOption('list');
                        }}
                      />
                      <IconButton
                        _active={{ bg: 'event.button.secondary.bg' }}
                        _focus={{ bg: 'event.button.secondary.bg' }}
                        _hover={{ bg: 'event.button.secondary.bg' }}
                        aria-label="Grid view"
                        bg='event.button.secondary.bg'
                        borderRadius="8px"
                        color={viewOption === 'grid' ? 'black' : 'gray.400'}
                        icon={<FaTh />}
                        onClick={() => {
                          setViewOption('grid');
                        }}
                      />
                    </ButtonGroup>
                  </HStack>
                </VStack>
                <VStack spacing={4} w="full">
                  {viewOption === 'list' ? renderAgendaItems() : renderGroupedAgendaItems()}
                </VStack>
              </VStack>
            </Flex>
          </Box>
        </IconBox>
      </VStack>
    </Center>
  );
};

export default AgendaPage;
