import { ChevronRightIcon } from '@chakra-ui/icons';
import { IconButton, type IconButtonProps } from '@chakra-ui/react';

interface NextButtonProps extends Omit<IconButtonProps, 'aria-label'> {}
export const NextButton = (props: NextButtonProps) => {
  return <IconButton aria-label="Next page" icon={<ChevronRightIcon h="5" w="5" />} {...props} />;
};
