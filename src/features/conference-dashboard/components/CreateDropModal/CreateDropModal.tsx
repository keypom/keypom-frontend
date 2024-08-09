import React, { useState, useEffect } from 'react';
import { VStack, Button, Center, Spinner, Heading } from '@chakra-ui/react';
import { NameInput } from './NameInput';
import { ImageInput } from './ImageInput';
import { NFTInformation } from './NFTInformation';
import { ScavengerHunt } from './ScavengerHunt';
import { ModalWrapper } from './ModalWrapper';
import { validateForm } from './dropUtils';
import DropTokenAmountSelector from './TokenAmountSelector';

const defaultDrop = {
  name: '',
  artwork: undefined,
  amount: '1',
  nftData: undefined,
};
const defaultScavengerHunt = [
  {
    piece: `Piece 1`,
    description: '',
  },
  {
    piece: `Piece 2`,
    description: '',
  },
];

export const CreateDropModal = ({ modalType, isOpen, onClose }) => {
  const [createdDrop, setCreatedDrop] = useState(defaultDrop);
  const [scavengerPieces, setScavengerPieces] =
    useState<Array<{ piece: string; description: string }>>(defaultScavengerHunt);

  const [isLoading, setIsLoading] = useState(false);
  const [isScavengerHunt, setIsScavengerHunt] = useState(false);
  const [errors, setErrors] = useState({});

  const resetValues = () => {
    setErrors({});
    setCreatedDrop(defaultDrop);
    setIsScavengerHunt(false);
    setScavengerPieces(defaultScavengerHunt);
  };

  const handleCreateDrop = () => {
    if (validateForm(createdDrop, setErrors)) {
      onClose(createdDrop, isScavengerHunt, scavengerPieces, setIsLoading);
      resetValues();
    }
  };
  const handleCancelDrop = () => {
    resetValues();
    onClose(undefined, isScavengerHunt, scavengerPieces, setIsLoading);
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={handleCancelDrop}>
      <Heading as="h3" marginBottom={6} size="lg">
        Create Drop
      </Heading>
      <VStack align="stretch" spacing={0}>
        <NameInput
          createdDrop={createdDrop}
          setCreatedDrop={setCreatedDrop}
          errors={errors}
          setErrors={setErrors}
        />
        {modalType === 'nft' && (
          <NFTInformation
            createdDrop={createdDrop}
            setCreatedDrop={setCreatedDrop}
            errors={errors}
            setErrors={setErrors}
          />
        )}
        {modalType === 'token' && (
          <>
            <ImageInput createdDrop={createdDrop} setCreatedDrop={setCreatedDrop} errors={errors} />
            <DropTokenAmountSelector
              currentDrop={createdDrop}
              setCurrentDrop={setCreatedDrop}
              errors={errors}
            />
          </>
        )}
        <ScavengerHunt
          isScavengerHunt={isScavengerHunt}
          setIsScavengerHunt={setIsScavengerHunt}
          scavengerPieces={scavengerPieces}
          setScavengerPieces={setScavengerPieces}
          errors={errors}
        />
        {isLoading ? (
          <Center>
            <Spinner size="lg" />
          </Center>
        ) : (
          <>
            <Button variant="primary" width="full" onClick={handleCreateDrop}>
              Create
            </Button>
            <Button variant="secondary" width="full" onClick={handleCancelDrop}>
              Cancel
            </Button>
          </>
        )}
      </VStack>
    </ModalWrapper>
  );
};
