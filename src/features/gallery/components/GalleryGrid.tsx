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
import { IconBox } from '@/components/IconBox';
import { TicketCard } from './TicketCard';

// props validation
interface GalleryGridProps extends BoxProps {
  loading?: boolean;
  data: DataItem[];
}

export const GalleryGrid = ({ loading = false, data = [], ...props }: GalleryGridProps) => {
  const loadingdata = [];

  //append 10 loading cards
  for (let i = 0; i < 10; i++) {
    const loadingCard = {
      id: i,
      name: 'Loading',
      type: 'Type 1',
      media: 'https://via.placeholder.com/300',
      claimed: 100,
    };
    loadingdata.push(loadingCard);
  }

  var temp = loading ? [...loadingdata] : [...data];

  console.log('temp', temp.length);

  return (
    <>
      <IconBox h="full" mt={{ base: '6', md: '7' }} pb={{ base: '6', md: '16' }} w="full" p="20px">
        <SimpleGrid minChildWidth="250px" spacing={5}>
          {temp?.map((event) => (
            <TicketCard surroundingNavLink={true} loading={loading} key={event.id} event={event} />
          ))}
        </SimpleGrid>
      </IconBox>
    </>
  );
};
