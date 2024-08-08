import {
  Button,
  Hide,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  Show,
  Textarea,
  VStack,
  Center,
  HStack,
  Spinner,
  useToast,
  Divider,
  Heading,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FormControlComponent } from '@/components/FormControl';
import { ImageFileInputSmall } from '@/components/ImageFileInput/ImageFileInputSmall';
import DropTokenAmountSelector from './TokenAmountSelector';

const defaultErrors = {
  name: '',
  artwork: '',
  nft: {
    title: '',
    description: '',
    media: '',
  },
};

export const isValidNonNegativeNumber = (value) => {
  return /^\d*\.?\d+$/.test(value);
};

export interface NFTDropData {
  title: string;
  description: string;
  media: File | undefined;
}

export interface CreatedDropForm {
  name: string;
  artwork: File | undefined;
  amount: string;
  nftData?: NFTDropData;
}

interface CreateDropModalProps {
  modalType: 'nft' | 'token';
  isOpen: boolean;
  onClose: (
    createdDrop: CreatedDropForm | undefined,
    setIsLoading: (loading: boolean) => void,
  ) => void;
}

export const CreateDropModal = ({ modalType, isOpen, onClose }: CreateDropModalProps) => {
  const [errors, setErrors] = useState(defaultErrors);
  const [createdDrop, setCreatedDrop] = useState<CreatedDropForm>({
    name: '',
    artwork: undefined,
    amount: '1',
  });
  const [preview, setPreview] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const validateForm = () => {
    let isErr = false;
    const newErrors = { ...defaultErrors };
    if (!createdDrop.name) {
      newErrors.name = 'Name is required';
      isErr = true;
    }

    if (!createdDrop.artwork) {
      newErrors.artwork = 'Artwork is required';
      isErr = true;
    }

    if (modalType === 'nft') {
      if (!createdDrop.nftData?.media) {
        newErrors.nft.media = 'NFT artwork is required';
        isErr = true;
      }

      if (!createdDrop.nftData?.title) {
        newErrors.nft.title = 'NFT title is required';
        isErr = true;
      }

      if (!createdDrop.nftData?.description) {
        newErrors.nft.description = 'NFT description is required';
        isErr = true;
      }
    }

    setErrors(newErrors);
    if (!isErr) {
      onClose(createdDrop, setIsLoading);
    }
  };

  const margins = '3';

  useEffect(() => {
    if (!isOpen) {
      setCreatedDrop({
        name: '',
        artwork: undefined,
        amount: '1',
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const selectedFile = createdDrop.artwork;
    if (selectedFile === undefined) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [createdDrop.artwork]);

  useEffect(() => {
    if (!isOpen) {
      setErrors(defaultErrors);
    }
  }, [isOpen]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setCreatedDrop({ ...createdDrop, artwork: undefined });
      return;
    }

    setCreatedDrop({ ...createdDrop, artwork: e.target.files[0] });
  };

  const onNFTDataChange = (key: string, value: string) => {
    setCreatedDrop({
      ...createdDrop,
      nftData: { ...createdDrop.nftData, [key]: value },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      size="5xl"
      onClose={() => {
        onClose(undefined, setIsLoading);
      }}
    >
      <ModalOverlay backdropFilter="blur(0px)" bg="blackAlpha.600" opacity="1" />
      <ModalContent maxH="95vh" overflowY="auto" padding={8} paddingY={6}>
        <Heading as="h3" size="lg" marginBottom={6}>
          Create Drop
        </Heading>
        <Show above="md">
          <VStack align="stretch" flex="1.5" spacing={0}>
            <FormControlComponent
              errorText={errors.name}
              label="Name*"
              labelProps={{ fontSize: { base: 'xs', md: 'md' } }}
              marginY={margins}
            >
              <Input
                borderRadius="5xl"
                height="35px"
                isInvalid={!!errors.name}
                maxLength={500}
                placeholder="Nuffle's Waffles"
                size="sm"
                sx={{
                  '::placeholder': {
                    color: 'gray.400',
                    fontSize: { base: 'xs', md: 'sm' },
                  },
                }}
                type="text"
                value={createdDrop.name}
                onChange={(e) => {
                  setErrors({ ...errors, name: '' });
                  setCreatedDrop({ ...createdDrop, name: e.target.value });
                }}
              />
            </FormControlComponent>
            <FormControlComponent
              label="Image*"
              labelProps={{ fontSize: { base: 'xs', md: 'md' } }}
              marginY={margins}
            >
              <ImageFileInputSmall
                accept="image/jpeg, image/png, image/gif"
                ctaText="Upload drop artwork"
                errorMessage={errors.artwork}
                isInvalid={!!errors.artwork}
                preview={preview}
                selectedFile={createdDrop.artwork}
                onChange={onSelectFile}
              />
            </FormControlComponent>

            {modalType === 'token' && (
              <DropTokenAmountSelector
                errors={errors}
                currentDrop={createdDrop}
                setCurrentDrop={setCreatedDrop}
              />
            )}
            {modalType === 'nft' && (
              <>
                <Divider marginTop={6} marginBottom={4} />
                <Heading as="h4" size="lg" marginBottom={2}>
                  NFT Information
                </Heading>
                <HStack spacing={6} alignItems="flex-start" justifyContent="space-between" w="100%">
                  <FormControlComponent
                    label="Title*"
                    labelProps={{ fontSize: { base: 'xs', md: 'md' } }}
                    errorText={errors.nft.title}
                    marginY={margins}
                    w="50%"
                  >
                    <Textarea
                      borderRadius="5xl"
                      height="35px"
                      isInvalid={!!errors.nft.title}
                      maxLength={500}
                      placeholder="NFT Title"
                      size="sm"
                      sx={{
                        '::placeholder': {
                          color: 'gray.400',
                          fontSize: { base: 'xs', md: 'sm' },
                        },
                      }}
                      value={createdDrop.nftData?.title || ''}
                      onChange={(e) => {
                        onNFTDataChange('title', e.target.value);
                      }}
                    />
                  </FormControlComponent>
                  <FormControlComponent
                    label="Description*"
                    labelProps={{ fontSize: { base: 'xs', md: 'md' } }}
                    errorText={errors.nft.description}
                    marginY={margins}
                    w="50%"
                  >
                    <Textarea
                      borderRadius="5xl"
                      height="35px"
                      isInvalid={!!errors.nft.description}
                      maxLength={500}
                      placeholder="NFT Description"
                      size="sm"
                      sx={{
                        '::placeholder': {
                          color: 'gray.400',
                          fontSize: { base: 'xs', md: 'sm' },
                        },
                      }}
                      value={createdDrop.nftData?.description || ''}
                      onChange={(e) => {
                        onNFTDataChange('description', e.target.value);
                      }}
                    />
                  </FormControlComponent>
                </HStack>
                <FormControlComponent
                  label="Media*"
                  labelProps={{ fontSize: { base: 'xs', md: 'md' } }}
                  marginY={margins}
                >
                  <ImageFileInputSmall
                    accept="image/jpeg, image/png, image/gif"
                    ctaText="Upload NFT artwork"
                    errorMessage={errors.nft.media}
                    isInvalid={!!errors.nft.media}
                    preview={preview}
                    selectedFile={createdDrop.nftData?.media}
                    onChange={(e) => {
                      onNFTDataChange('media', e.target.files ? e.target.files[0] : undefined);
                    }}
                  />
                </FormControlComponent>
              </>
            )}
          </VStack>
        </Show>
        <Hide above="md">
          <VStack align="stretch" paddingBottom={4} spacing={1}>
            <FormControlComponent
              errorText={errors.name}
              label="Name*"
              labelProps={{ fontSize: { base: 'xs', md: 'md' } }}
              marginY={margins}
            >
              <Input
                borderRadius="5xl"
                height="35px"
                isInvalid={!!errors.name}
                maxLength={500}
                placeholder="Red Wedding VIP Ticket"
                size="sm"
                sx={{
                  '::placeholder': {
                    color: 'gray.400',
                    fontSize: { base: 'xs', md: 'sm' },
                  },
                }}
                type="text"
                value={createdDrop.name}
                onChange={(e) => {
                  setErrors({ ...errors, name: '' });
                  setCreatedDrop({ ...createdDrop, name: e.target.value });
                }}
              />
            </FormControlComponent>
            <FormControlComponent
              label="Image*"
              labelProps={{ fontSize: { base: 'xs', md: 'md' } }}
              marginY={margins}
            >
              <ImageFileInputSmall
                accept=" image/jpeg, image/png, image/gif"
                ctaText="Upload artwork"
                errorMessage={errors.artwork}
                isInvalid={!!errors.artwork}
                preview={preview}
                selectedFile={createdDrop.artwork}
                onChange={onSelectFile}
              />
            </FormControlComponent>
            {modalType === 'token' && (
              <DropTokenAmountSelector
                errors={errors}
                currentDrop={createdDrop}
                setCurrentDrop={setCreatedDrop}
              />
            )}
            {modalType === 'nft' && (
              <>
                <Divider marginTop={6} marginBottom={2} />
                <Heading as="h4" size="md" marginBottom={2}>
                  NFT Information
                </Heading>
                <FormControlComponent
                  label="Title*"
                  labelProps={{ fontSize: { base: 'xs', md: 'md' } }}
                  errorText={errors.nft.title}
                  marginY={margins}
                >
                  <Input
                    borderRadius="5xl"
                    height="35px"
                    isInvalid={!!errors.nft.title}
                    maxLength={500}
                    placeholder="NFT Title"
                    size="sm"
                    sx={{
                      '::placeholder': {
                        color: 'gray.400',
                        fontSize: { base: 'xs', md: 'sm' },
                      },
                    }}
                    type="text"
                    value={createdDrop.nftData?.title || ''}
                    onChange={(e) => {
                      onNFTDataChange('title', e.target.value);
                    }}
                  />
                </FormControlComponent>
                <FormControlComponent
                  label="Description*"
                  labelProps={{ fontSize: { base: 'xs', md: 'md' } }}
                  errorText={errors.nft.description}
                  marginY={margins}
                >
                  <Textarea
                    borderRadius="5xl"
                    height="35px"
                    isInvalid={!!errors.nft.description}
                    maxLength={500}
                    placeholder="NFT Description"
                    size="sm"
                    sx={{
                      '::placeholder': {
                        color: 'gray.400',
                        fontSize: { base: 'xs', md: 'sm' },
                      },
                    }}
                    value={createdDrop.nftData?.description || ''}
                    onChange={(e) => {
                      onNFTDataChange('description', e.target.value);
                    }}
                  />
                </FormControlComponent>
                <FormControlComponent
                  label="Media*"
                  labelProps={{ fontSize: { base: 'xs', md: 'md' } }}
                  marginY={margins}
                >
                  <ImageFileInputSmall
                    accept="image/jpeg, image/png, image/gif"
                    ctaText="Upload NFT artwork"
                    errorMessage={errors.nft.media}
                    isInvalid={!!errors.nft.media}
                    preview={preview}
                    selectedFile={createdDrop.nftData?.media}
                    onChange={(e) => {
                      onNFTDataChange('media', e.target.files ? e.target.files[0] : undefined);
                    }}
                  />
                </FormControlComponent>
              </>
            )}
          </VStack>
        </Hide>
        <VStack align="left" spacing={0} textAlign="left" paddingTop={6}>
          <VStack align="left" spacing={3} textAlign="left">
            {isLoading ? (
              <Center>
                <Spinner size="lg" />
              </Center>
            ) : (
              <>
                <Button
                  autoFocus={false}
                  variant="primary"
                  width="full"
                  onClick={() => {
                    validateForm();
                  }}
                >
                  Create
                </Button>
                <Button
                  autoFocus={false}
                  variant="secondary"
                  width="full"
                  onClick={() => {
                    onClose(undefined, setIsLoading);
                  }}
                >
                  Cancel
                </Button>
              </>
            )}
          </VStack>
        </VStack>
      </ModalContent>
    </Modal>
  );
};
