import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Text,
  Flex,
  VStack,
} from '@chakra-ui/react';
import { NavLink, useLoaderData } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { ArrowDownIcon, ArrowUpIcon, ExternalLinkIcon } from '@chakra-ui/icons';

import myData from '../data/db.json';

// import myData from '../data/db.json';

// props validation
Gallery.propTypes = {
  isSecondary: PropTypes.bool,
};

export default function Gallery(props) {
  const allEvents = useLoaderData().events;
  const [events, setEvents] = useState(allEvents);
  const isSecondary = props.isSecondary || false;
  const [sorted, setSorted] = useState({ sorted: 'id', reversed: false });

  const subLinkLocation = isSecondary ? 'secondary-market' : 'gallery';

  // search value
  const [searchPhrase, setSearchPhrase] = useState('');
  const handleChange = (changeEvent) => {
    setSearchPhrase(changeEvent.target.value);
    const matchedEvents = allEvents.filter((event) => {
      return event.title.toLowerCase().includes(changeEvent.target.value.toLowerCase());
    });
    setEvents(matchedEvents);
  };

  const sortById = () => {
    if (sorted.sorted === 'id') {
      setSorted({ sorted: 'id', reversed: !sorted.reversed });
    } else {
      setSorted({ sorted: 'id', reversed: false });
    }
    const eventsCopy = [...events];
    eventsCopy.sort((eventA, eventB) => {
      if (sorted.reversed) {
        return eventA.id - eventB.id;
      }
      return eventB.id - eventA.id;
    });
    setEvents(eventsCopy);
  };

  const sortByTitle = () => {
    if (sorted.sorted === 'title') {
      setSorted({ sorted: 'title', reversed: !sorted.reversed });
    } else {
      setSorted({ sorted: 'title', reversed: false });
    }
    const eventsCopy = [...events];
    eventsCopy.sort((eventA, eventB) => {
      if (sorted.reversed) {
        return eventA.title.localeCompare(eventB.title);
      }
      return eventB.title.localeCompare(eventA.title);
    });
    setEvents(eventsCopy);
  };

  const RenderArrow = () => {
    if (sorted.reversed) {
      return <ArrowUpIcon />;
    }
    return <ArrowDownIcon />;
  };

  const sortByDate = () => {
    if (sorted.sorted === 'date') {
      setSorted({ sorted: 'date', reversed: !sorted.reversed });
    } else {
      setSorted({ sorted: 'date', reversed: false });
    }
    const eventsCopy = [...events];
    eventsCopy.sort((eventA, eventB) => {
      if (sorted.reversed) {
        return eventA.date.localeCompare(eventB.date);
      }
      return eventB.date.localeCompare(eventA.date);
    });
    setEvents(eventsCopy);
  };

  return (
    <Box p="10">
      <Divider bg="black" my="5" />

      <Flex>
        {isSecondary ? (
          <Heading as="h1" style={{ whiteSpace: 'nowrap' }}>
            {' '}
            Secondary Market{' '}
          </Heading>
        ) : (
          <Heading as="h1" style={{ whiteSpace: 'nowrap' }}>
            {' '}
            Upcoming Events{' '}
          </Heading>
        )}
        <Input
          mx="10"
          placeholder="search"
          size="md"
          value={searchPhrase}
          onChange={handleChange}
        />

        <Button mx="2" onClick={sortByDate}>
          {sorted.sorted === 'date' ? RenderArrow() : null}
          Date
        </Button>
        <Button mx="2" onClick={sortByTitle}>
          {sorted.sorted === 'title' ? RenderArrow() : null}
          Title
        </Button>
        <Button mx="2" onClick={sortById}>
          {sorted.sorted === 'id' ? RenderArrow() : null}
          Id
        </Button>
      </Flex>

      <Divider bg="black" my="5" />
      <SimpleGrid minChildWidth="300px" spacing={10}>
        {events?.map((event) => (
          <Card
            key={event.id}
            bg="linear-gradient(180deg, rgba(255, 207, 234, 0) 0%, #30c9f34b 100%)"
            borderRadius={{ base: '1rem', md: '8xl' }}
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            {/* <Flex
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
              }}
            > */}
            <NavLink to={'../' + subLinkLocation + '/' + String(event.id)}>
              <CardHeader position="relative">
                <Image alt={event.title} src={event.img} />
                <Box
                  bg="white"
                  border="1px solid black"
                  color="black"
                  left="25"
                  p={2}
                  position="absolute"
                  rounded="lg"
                  top="25"
                >
                  ${event.price}
                </Box>
                <NavLink to={'./'}>
                  <Box
                    alignItems="center"
                    bg="white"
                    borderRadius="50%" // Make it a circle
                    color="black"
                    display="flex" // Center the icon
                    height="40px"
                    justifyContent="center"
                    p={2}
                    position="absolute"
                    right="25"
                    top="25"
                    width="40px"
                    onClick={() =>
                      window.open('../' + subLinkLocation + '/' + String(event.id), '_blank')
                    }
                  >
                    <ExternalLinkIcon mx="2px" />
                  </Box>
                </NavLink>
              </CardHeader>
              <CardBody color="black">
                <Heading as="h2" size="sm">
                  {event.title}
                </Heading>
              </CardBody>
              <CardFooter>
                <VStack align="start" spacing={2}>
                  <Text my="2px">Event on {event.date}</Text>
                  <Text my="2px">Event in {event.location}</Text>
                </VStack>
              </CardFooter>
            </NavLink>
            {/* </Flex> */}
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export const eventsLoader = async () => {
  // const res = await fetch("http://localhost:3000/events");

  return myData;
};
