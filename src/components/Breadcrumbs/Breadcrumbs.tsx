import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';

export interface IBreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbProps {
  items: IBreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbProps) => {
  const breadcrumbItems = items.map((item, index) => (
    <BreadcrumbItem key={item.name} color={index === items.length - 1 ? 'gray.800' : 'gray.400'}>
      <BreadcrumbLink as={Link} fontSize={{ base: 'sm', md: 'md' }} to={item.href}>
        {item.name}
      </BreadcrumbLink>
    </BreadcrumbItem>
  ));
  return (
    <Breadcrumb separator={<ChevronRightIcon color="gray.400" />} spacing="8px">
      {breadcrumbItems}
    </Breadcrumb>
  );
};
