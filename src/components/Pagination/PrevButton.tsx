import { ChevronLeftIcon } from '@chakra-ui/icons';
import { IconButton, type IconButtonProps } from '@chakra-ui/react';

interface PrevButtonProps extends Omit<IconButtonProps, 'aria-label'> {
  id: string;
}
export const PrevButton = ({ id, ...props }: PrevButtonProps) => {
  return (
    <IconButton
      aria-label={`${id}-previous-page-button`}
      icon={<ChevronLeftIcon h="5" w="5" />}
      {...props}
    />
  );
};
