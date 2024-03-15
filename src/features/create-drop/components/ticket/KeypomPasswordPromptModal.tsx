import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useToast,
  Text,
  VStack,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

import { set } from '@/utils/localStorage';
import { EyeIcon } from '@/components/Icons/EyeIcon';

interface KeypomPasswordPromptModalProps {
  isOpen: boolean;
  isSetting: boolean;
  onModalClose: () => void;
}

export const KeypomPasswordPromptModal = ({
  isOpen,
  isSetting,
  onModalClose,
}: KeypomPasswordPromptModalProps) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();

  const handlePasswordSubmit = () => {
    // Perform any validation you need here
    if (password.length < 8) {
      toast({
        title: 'Password too short.',
        description: "Please enter a password that's at least 8 characters long.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // If validation passes, save the password
    set('MASTER_KEY', password);
    onModalClose();
    toast({
      title: 'Password set successfully.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const handlePasswordVisibilityToggle = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Modal isOpen={isOpen} size="xl" onClose={onModalClose}>
      <ModalOverlay backdropFilter="blur(0px)" bg="blackAlpha.600" opacity="1" />
      <ModalContent
        maxH="90vh"
        overflow="visible !important"
        overflowY="auto"
        paddingBottom="6"
        paddingTop="12"
        position="relative"
        px="6"
      >
        <IconButton
          aria-label="Ticket Icon"
          bgColor="#DDF4FA" // Or any color that matches the modal background
          border="2px solid transparent"
          borderColor="blue.200"
          borderRadius="full"
          height="60px"
          icon={<EyeIcon h="28px" />} // replace with your actual icon
          left="50%"
          overflow="visible !important"
          position="absolute"
          top={-6} // Half of the icon size to make it center on the edge
          transform="translateX(-50%) translateY(-10%)"
          variant="outline"
          width="60px"
          zIndex={1500} // Higher than ModalContent to overlap
        />
        <ModalHeader fontSize="lg" fontWeight="semibold">
          Set your Keypom password
        </ModalHeader>
        <VStack align="start" spacing={4} textAlign="left">
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack align="start" spacing={4} textAlign="left">
              <Text color="gray.600" fontSize="md">
                To create an event, you need to set a Keypom password. This allows you to manage
                your event securely.
              </Text>
              <InputGroup>
                <Input
                  errorBorderColor="red.300"
                  placeholder="Enter a password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <InputRightElement width="4.5rem">
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    h="1.75rem"
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    size="sm"
                    variant="ghost"
                    onClick={handlePasswordVisibilityToggle}
                  />
                </InputRightElement>
              </InputGroup>
              <Text color="red.500" fontSize="sm">
                Do not lose your password. It cannot be recovered if lost.
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter width="100%">
            <Button
              colorScheme="blue"
              isLoading={isSetting}
              width="100%"
              onClick={handlePasswordSubmit}
            >
              Set Password and Pay
            </Button>
          </ModalFooter>
        </VStack>
      </ModalContent>
    </Modal>
  );
};
