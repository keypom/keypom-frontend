import { Center, Icon, Spinner } from '@chakra-ui/react';
// For icons, assuming you're using Chakra UI icons or you can replace them with your preferred icons
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

interface LoadingOverlayProps {
  isVisible: boolean;
  status?: 'success' | 'error';
}

export const LoadingOverlay = ({ isVisible, status }: LoadingOverlayProps) => {
  if (!isVisible) return null;

  let backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Default semi-transparent background
  let content = <Spinner color="white" size="xl" />;

  if (status === 'success') {
    backgroundColor = 'rgba(0, 255, 0, 0.5)'; // Green for success
    content = <Icon as={CheckIcon} boxSize="4rem" color="white" />;
  } else if (status === 'error') {
    backgroundColor = 'rgba(255, 0, 0, 0.5)'; // Red for error
    content = <Icon as={CloseIcon} boxSize="4rem" color="white" />;
  }

  return (
    <Center
      backgroundColor={backgroundColor}
      bottom="0"
      left="0"
      position="absolute"
      right="0"
      top="0"
    >
      {content}
    </Center>
  );
};
