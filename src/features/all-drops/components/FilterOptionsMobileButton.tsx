import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button } from '@chakra-ui/react';

export const FilterOptionsMobileButton = ({
  buttonTitle,
  onOpen,
  popoverClicked,
}: {
  buttonTitle: string;
  onOpen: () => void;
  popoverClicked: React.MutableRefObject<number>;
}) => (
  <Button
    height="full"
    lineHeight=""
    px="6"
    rightIcon={<ChevronDownIcon />}
    variant="secondary-content-box"
    onClick={() => {
      popoverClicked.current += 1;
      onOpen();
    }}
  >
    {buttonTitle}
  </Button>
);
