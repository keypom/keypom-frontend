import React, { PropsWithChildren } from 'react';
import { Heading as CHeading, HeadingProps as CHeadingProps } from '@chakra-ui/react';

interface HeadingProps extends CHeadingProps {
  children: React.ReactNode;
}

export const Heading = ({ children, ...props }: PropsWithChildren<HeadingProps>) => {
  return (
    <CHeading fontSize={{ base: '2xl', md: '4xl' }} fontWeight="medium" {...props}>
      {children}
    </CHeading>
  );
};
