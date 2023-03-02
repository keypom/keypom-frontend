import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverHeader,
  type PopoverProps,
  PopoverTrigger,
  type PopoverContentProps,
  type PopoverHeaderProps,
} from '@chakra-ui/react';
import { type PropsWithChildren } from 'react';

interface PopoverTemplateProps extends PopoverProps {
  shouldOpen: boolean;
  header?: string;
  popoverHeaderProps?: PopoverHeaderProps;
  bodyComponent?: React.ReactNode;
  popoverContentProps?: PopoverContentProps;
  hasArrow?: boolean;
}

export const PopoverTemplate = ({
  shouldOpen,
  header,
  popoverHeaderProps,
  bodyComponent,
  popoverContentProps,
  hasArrow = true,
  children,
  ...props
}: PropsWithChildren<PopoverTemplateProps>) => {
  return (
    <Popover closeOnBlur defaultIsOpen={shouldOpen} placement="left" {...props}>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent bg="gray.800" color="gray.50" {...popoverContentProps}>
        {header && (
          <PopoverHeader border="0" fontWeight="bold" p="4" pr="0" {...popoverHeaderProps}>
            {header}
          </PopoverHeader>
        )}
        {bodyComponent}
        {hasArrow && <PopoverArrow bg="gray.800" />}
      </PopoverContent>
    </Popover>
  );
};
