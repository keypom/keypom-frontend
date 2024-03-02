import {
  Text,
  Heading,
  VStack,
  BoxProps,
  SimpleGrid,
  Card,
  CardHeader,
  Image,
  Box,
  CardBody,
  CardFooter,
  Skeleton,
  SkeletonText,
} from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router-dom';

import { type DataItem } from './types';

// props validation
interface GalleryGridProps extends BoxProps {
  loading?: boolean;
  data: DataItem[];
}

export const GalleryGrid = ({ loading = false, data = [], ...props }: GalleryGridProps) => {
  const loadingdata = [
    {
      id: 1,
      name: 'Event 1',
      type: 'Type 1',
      media: 'https://via.placeholder.com/300',
      claimed: 100,
    },
    {
      id: 2,
      name: 'Event 2',
      type: 'Type 2',
      media: 'https://via.placeholder.com/300',
      claimed: 200,
    },
    {
      id: 3,
      name: 'Event 3',
      type: 'Type 3',
      media: 'https://via.placeholder.com/300',
      claimed: 300,
    },
  ];
  if (loading) {
    return (
      <>
        <SimpleGrid minChildWidth="300px" spacing={10}>
          {loadingdata.map((event) => (
            <Card
              key={event.id}
              borderRadius={{ base: '1rem', md: '8xl' }}
              style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <CardHeader position="relative">
                <Skeleton
                  bg="white"
                  border="1px solid black"
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
          ))}
        </SimpleGrid>
      </>
    );
  }

  return (
    <>
      <SimpleGrid minChildWidth="300px" spacing={10}>
        {data?.map((event) => (
          <Card
            transition="transform 0.2s"
            _hover={{ transform: 'scale(1.05)' }}
            key={event.id}
            borderRadius={{ base: '1rem', md: '8xl' }}
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            {console.log(event)}
            {/* <Flex
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
              }}
            > */}
            <NavLink to={'../gallery/' + String(event.id)}>
              <CardHeader position="relative">
                <Image
                  alt={event.name}
                  borderRadius="md"
                  height="300px"
                  objectFit="cover"
                  src={event.medfia}
                  width="100%"
                />
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
                  ${event.claimed}
                </Box>
                {/* <NavLink to={'./'}>
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
                </NavLink> */}
              </CardHeader>
              <CardBody color="black">
                <Heading as="h2" size="sm">
                  {event.name}
                </Heading>
              </CardBody>
              <CardFooter>
                <VStack align="start" spacing={2}>
                  <Text my="2px">Event on {event.type}</Text>
                  <Text my="2px">Event in {event.id}</Text>
                </VStack>
              </CardFooter>
            </NavLink>
            {/* </Flex> */}
          </Card>
        ))}
      </SimpleGrid>
    </>
  );
};
