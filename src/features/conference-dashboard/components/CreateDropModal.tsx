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
  FormControl,
  Switch,
  Tooltip,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { DeleteIcon } from '@chakra-ui/icons';

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
  scavengerHunt?: Array<{ piece: string; description: string }>;
}

interface CreateDropModalProps {
  modalType: 'nft' | 'token';
  isOpen: boolean;
  onClose: (
    createdDrop: CreatedDropForm | undefined,
    isScavengerHunt: boolean,
    scavengerHunt: Array<{ piece: string; description: string }>,
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
  const [isScavengerHunt, setIsScavengerHunt] = useState(false);
  const [scavengerPieces, setScavengerPieces] = useState<
    Array<{ piece: string; description: string }>
  >([
    { piece: `Piece 1`, description: '' },
    { piece: `Piece 2`, description: '' },
  ]);
  const [tempNumPieces, setTempNumPieces] = useState('2');
  const [numPiecesError, setNumPiecesError] = useState('');
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
      onClose(createdDrop, isScavengerHunt, scavengerPieces, setIsLoading);
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

  const handleNumPiecesChange = (e) => {
    const value = e.target.value;
    if (isValidNonNegativeNumber(value) || value === '') {
      setTempNumPieces(value);
    }
  };

  const updateNumPieces = () => {
    let numPieces = parseInt(tempNumPieces, 10);
    if (isNaN(numPieces) || numPieces < 2) {
      setNumPiecesError('Scavenger hunts need to have at least 2 pieces.');
      numPieces = 2; // Minimum 2 pieces if scavenger hunt is active
    } else {
      setNumPiecesError('');
    }

    if (numPieces <= 10) {
      const newPieces = Array.from({ length: numPieces }, (_, i) => ({
        piece: `Piece ${i + 1}`,
        description: '',
      }));
      setScavengerPieces(newPieces);
      setTempNumPieces(numPieces.toString());
    }
  };

  const addScavengerPiece = () => {
    if (scavengerPieces.length < 10) {
      const newPiece = { piece: `Piece ${scavengerPieces.length + 1}`, description: '' };
      setScavengerPieces([...scavengerPieces, newPiece]);
      setTempNumPieces((scavengerPieces.length + 1).toString());
    }
  };

  const updateScavengerPieceDescription = (index, value) => {
    const newPieces = [...scavengerPieces];
    newPieces[index].description = value;
    setScavengerPieces(newPieces);
  };

  const removeScavengerPiece = (index) => {
    if (scavengerPieces.length > 2) {
      // Ensure there's always at least 2 pieces
      let newPieces = scavengerPieces.filter((_, i) => i !== index);

      // Reassign piece numbers to ensure they are sequential
      newPieces = newPieces.map((piece, i) => ({
        ...piece,
        piece: `Piece ${i + 1}`,
      }));

      setScavengerPieces(newPieces);
      setTempNumPieces(newPieces.length.toString());
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      size="2xl"
      onClose={() => {
        onClose(undefined, isScavengerHunt, scavengerPieces, setIsLoading);
      }}
    >
      <ModalOverlay backdropFilter="blur(0px)" bg="blackAlpha.600" opacity="1" />
      <ModalContent maxH="95vh" overflowY="auto" padding={8} paddingY={6}>
        <Heading as="h3" marginBottom={6} size="lg">
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
                currentDrop={createdDrop}
                errors={errors}
                setCurrentDrop={setCreatedDrop}
              />
            )}
            {modalType === 'nft' && (
              <>
                <Divider marginBottom={4} marginTop={6} />
                <Heading as="h4" marginBottom={2} size="lg">
                  NFT Information
                </Heading>
                <HStack alignItems="flex-start" justifyContent="space-between" spacing={6} w="100%">
                  <FormControlComponent
                    errorText={errors.nft.title}
                    label="Title*"
                    labelProps={{ fontSize: { base: 'xs', md: 'md' } }}
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
                    errorText={errors.nft.description}
                    label="Description*"
                    labelProps={{ fontSize: { base: 'xs', md: 'md' } }}
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
            <Divider marginBottom={4} marginTop={6} />
            <FormControl alignItems="center" display="flex" marginBottom={4}>
              <HStack justify="space-between" w="100%">
                <Tooltip
                  label="Scavenger hunts require users to collect all the pieces before the reward is given."
                  fontSize="md"
                >
                  <HStack spacing={4}>
                    <Text>Enable Scavenger Hunt</Text>
                    <Switch
                      id="scavenger-hunt"
                      isChecked={isScavengerHunt}
                      onChange={() => {
                        setIsScavengerHunt(!isScavengerHunt);
                      }}
                    />
                  </HStack>
                </Tooltip>
                {isScavengerHunt && (
                  <HStack justify="flex-end" spacing={4}>
                    <Text>Num Pieces</Text>
                    <Input
                      type="text"
                      value={tempNumPieces}
                      w="25%"
                      onBlur={updateNumPieces}
                      onChange={handleNumPiecesChange}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          updateNumPieces();
                        }
                      }}
                    />
                  </HStack>
                )}
              </HStack>
            </FormControl>
            {numPiecesError && (
              <Text color="red.500" fontSize="sm" marginBottom={4}>
                {numPiecesError}
              </Text>
            )}
            {isScavengerHunt && (
              <>
                <VStack align="stretch" spacing={4}>
                  {scavengerPieces.map((piece, index) => (
                    <VStack key={index} alignItems="flex-start" w="100%">
                      <Text>{piece.piece}</Text>
                      <HStack alignItems="center" spacing={4} w="100%">
                        <Input
                          placeholder="Description"
                          value={piece.description}
                          onChange={(e) => updateScavengerPieceDescription(index, e.target.value)}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeScavengerPiece(index)}
                          isDisabled={scavengerPieces.length <= 2}
                        >
                          <DeleteIcon />
                        </Button>
                      </HStack>
                    </VStack>
                  ))}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={addScavengerPiece}
                    isDisabled={scavengerPieces.length >= 10}
                  >
                    Add Piece
                  </Button>
                </VStack>
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
                currentDrop={createdDrop}
                errors={errors}
                setCurrentDrop={setCreatedDrop}
              />
            )}
            {modalType === 'nft' && (
              <>
                <Divider marginBottom={2} marginTop={6} />
                <Heading as="h4" marginBottom={2} size="md">
                  NFT Information
                </Heading>
                <FormControlComponent
                  errorText={errors.nft.title}
                  label="Title*"
                  labelProps={{ fontSize: { base: 'xs', md: 'md' } }}
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
                  errorText={errors.nft.description}
                  label="Description*"
                  labelProps={{ fontSize: { base: 'xs', md: 'md' } }}
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
            <Divider marginBottom={4} marginTop={6} />
            <FormControl alignItems="center" display="flex" marginBottom={4}>
              <HStack justify="space-between" w="100%">
                <Tooltip
                  label="Scavenger hunts require users to collect all the pieces before the reward is given."
                  fontSize="md"
                >
                  <HStack spacing={4}>
                    <Text>Enable Scavenger Hunt</Text>
                    <Switch
                      id="scavenger-hunt"
                      isChecked={isScavengerHunt}
                      onChange={() => {
                        setIsScavengerHunt(!isScavengerHunt);
                      }}
                    />
                  </HStack>
                </Tooltip>
                {isScavengerHunt && (
                  <HStack justify="flex-end" spacing={4}>
                    <Text>Num Pieces</Text>
                    <Input
                      type="text"
                      value={tempNumPieces}
                      w="25%"
                      onBlur={updateNumPieces}
                      onChange={handleNumPiecesChange}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          updateNumPieces();
                        }
                      }}
                    />
                  </HStack>
                )}
              </HStack>
            </FormControl>
            {numPiecesError && (
              <Text color="red.500" fontSize="sm" marginBottom={4}>
                {numPiecesError}
              </Text>
            )}
            {isScavengerHunt && (
              <>
                <VStack align="stretch" spacing={4}>
                  {scavengerPieces.map((piece, index) => (
                    <VStack key={index} alignItems="flex-start" w="100%">
                      <Text>{piece.piece}</Text>
                      <HStack alignItems="center" spacing={4} w="100%">
                        <Input
                          placeholder="Description"
                          value={piece.description}
                          onChange={(e) => updateScavengerPieceDescription(index, e.target.value)}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeScavengerPiece(index)}
                          isDisabled={scavengerPieces.length <= 2}
                        >
                          <DeleteIcon />
                        </Button>
                      </HStack>
                    </VStack>
                  ))}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={addScavengerPiece}
                    isDisabled={scavengerPieces.length >= 10}
                  >
                    Add Piece
                  </Button>
                </VStack>
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
                currentDrop={createdDrop}
                errors={errors}
                setCurrentDrop={setCreatedDrop}
              />
            )}
            {modalType === 'nft' && (
              <>
                <Divider marginBottom={2} marginTop={6} />
                <Heading as="h4" marginBottom={2} size="md">
                  NFT Information
                </Heading>
                <FormControlComponent
                  errorText={errors.nft.title}
                  label="Title*"
                  labelProps={{ fontSize: { base: 'xs', md: 'md' } }}
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
                  errorText={errors.nft.description}
                  label="Description*"
                  labelProps={{ fontSize: { base: 'xs', md: 'md' } }}
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
            <Divider marginBottom={4} marginTop={6} />
            <FormControl alignItems="center" display="flex" marginBottom={4}>
              <HStack justify="space-between" w="100%">
                <Tooltip
                  label="Scavenger hunts require users to collect all the pieces before the reward is given."
                  fontSize="md"
                >
                  <HStack spacing={4}>
                    <Text>Enable Scavenger Hunt</Text>
                    <Switch
                      id="scavenger-hunt"
                      isChecked={isScavengerHunt}
                      onChange={() => {
                        setIsScavengerHunt(!isScavengerHunt);
                      }}
                    />
                  </HStack>
                </Tooltip>
                {isScavengerHunt && (
                  <HStack justify="flex-end" spacing={4}>
                    <Text>Num Pieces</Text>
                    <Input
                      type="text"
                      value={tempNumPieces}
                      w="25%"
                      onBlur={updateNumPieces}
                      onChange={handleNumPiecesChange}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          updateNumPieces();
                        }
                      }}
                    />
                  </HStack>
                )}
              </HStack>
            </FormControl>
            {numPiecesError && (
              <Text color="red.500" fontSize="sm" marginBottom={4}>
                {numPiecesError}
              </Text>
            )}
            {isScavengerHunt && (
              <>
                <VStack align="stretch" spacing={4}>
                  {scavengerPieces.map((piece, index) => (
                    <VStack key={index} alignItems="flex-start" w="100%">
                      <Text>{piece.piece}</Text>
                      <HStack alignItems="center" spacing={4} w="100%">
                        <Input
                          placeholder="Description"
                          value={piece.description}
                          onChange={(e) => updateScavengerPieceDescription(index, e.target.value)}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeScavengerPiece(index)}
                          isDisabled={scavengerPieces.length <= 2}
                        >
                          <DeleteIcon />
                        </Button>
                      </HStack>
                    </VStack>
                  ))}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={addScavengerPiece}
                    isDisabled={scavengerPieces.length >= 10}
                  >
                    Add Piece
                  </Button>
                </VStack>
              </>
            )}
          </VStack>
        </Hide>
        <VStack align="left" paddingTop={6} spacing={0} textAlign="left">
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
                    onClose(undefined, isScavengerHunt, scavengerPieces, setIsLoading);
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
