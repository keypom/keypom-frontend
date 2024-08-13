import React from 'react';
import { VStack, HStack, Textarea, Input, Divider, Heading } from '@chakra-ui/react';
import { FormControlComponent } from '@/components/FormControl';
import { ImageInput } from './ImageInput';

interface NFTInformationProps {
  createdDrop: any;
  setCreatedDrop: React.Dispatch<React.SetStateAction<any>>;
  errors: any;
  setErrors: React.Dispatch<React.SetStateAction<any>>;
}

export const NFTInformation: React.FC<NFTInformationProps> = ({
  createdDrop,
  setCreatedDrop,
  errors,
  setErrors,
}) => {
  const onNFTDataChange = (key: string, value: string) => {
    setCreatedDrop({
      ...createdDrop,
      nftData: { ...createdDrop.nftData, [key]: value },
    });
  };

  return (
    <>
      <VStack spacing={0} w="100%">
        <HStack spacing={6} w="100%">
          <FormControlComponent label="NFT Title*" errorText={errors.nft?.title} my="1">
            <Textarea
              value={createdDrop.nftData?.title || ''}
              onChange={(e) => onNFTDataChange('title', e.target.value)}
              isInvalid={!!errors.nft?.title}
              placeholder="Coolest NFT ever"
            />
          </FormControlComponent>
          <FormControlComponent label="NFT Description*" errorText={errors.nft?.description}>
            <Textarea
              value={createdDrop.nftData?.description || ''}
              onChange={(e) => onNFTDataChange('description', e.target.value)}
              isInvalid={!!errors.nft?.description}
              placeholder="One of a kind proof of touch"
            />
          </FormControlComponent>
        </HStack>
        <ImageInput
          createdDrop={createdDrop}
          setCreatedDrop={setCreatedDrop}
          errors={errors}
        />
      </VStack>
    </>
  );
};
