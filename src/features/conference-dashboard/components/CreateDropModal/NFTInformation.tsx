import React from 'react';
import { VStack, HStack, Textarea, Input, Divider, Heading } from '@chakra-ui/react';
import { FormControlComponent } from '@/components/FormControl';
import { ImageInput } from './ImageInput';

interface NFTInformationProps {
  createdDrop: any;
  setCreatedDrop: React.Dispatch<React.SetStateAction<any>>;
  errors: any;
}

export const NFTInformation: React.FC<NFTInformationProps> = ({
  createdDrop,
  setCreatedDrop,
  errors,
}) => {
  const onNFTDataChange = (key: string, value: string) => {
    setCreatedDrop({
      ...createdDrop,
      nftData: { ...createdDrop.nftData, [key]: value },
    });
  };

  return (
    <>
      <Divider my={4} />

      <Heading as="h4" marginBottom={0} size="lg">
        NFT Information
      </Heading>
      <VStack spacing={0} w="100%">
        <HStack spacing={6} w="100%">
          <FormControlComponent label="NFT Title*" errorText={errors.nft?.title}>
            <Textarea
              value={createdDrop.nftData?.title || ''}
              onChange={(e) => onNFTDataChange('title', e.target.value)}
              isInvalid={!!errors.nft?.title}
              placeholder="NFT Title"
            />
          </FormControlComponent>
          <FormControlComponent label="NFT Description*" errorText={errors.nft?.description}>
            <Textarea
              value={createdDrop.nftData?.description || ''}
              onChange={(e) => onNFTDataChange('description', e.target.value)}
              isInvalid={!!errors.nft?.description}
              placeholder="NFT Description"
            />
          </FormControlComponent>
        </HStack>
        <ImageInput createdDrop={createdDrop} setCreatedDrop={setCreatedDrop} errors={errors} />
      </VStack>
    </>
  );
};
