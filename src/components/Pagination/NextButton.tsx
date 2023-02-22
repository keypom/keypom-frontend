import { ChevronRightIcon } from '@chakra-ui/icons';
import { IconButton, type IconButtonProps } from '@chakra-ui/react';

interface NextButtonProps extends Omit<IconButtonProps, 'aria-label'> {
  id: string;
}
export const NextButton = ({ id, ...props }: NextButtonProps) => {
  return (
    <IconButton
      aria-label={`${id}-previous-page-button`}
      icon={<ChevronRightIcon h="5" w="5" />}
      {...props}
    />
  );
};
