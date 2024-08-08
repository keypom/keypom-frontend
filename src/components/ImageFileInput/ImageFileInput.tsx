import {
  Center,
  Flex,
  type FlexProps,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  type InputProps,
  Text,
  Image,
  Show,
} from '@chakra-ui/react';

import { ImageIcon } from '../Icons';

interface ImageFileInputProps extends InputProps {
  label?: string;
  ctaText?: string;
  buttonText?: string;
  selectedFile?: File;
  preview?: string;
  errorMessage?: string;
  flexProps?: FlexProps;
}

export const ImageFileInput = ({
  label,
  ctaText = 'Browse or drag and drop your image here',
  buttonText = 'Browse images',
  selectedFile,
  preview,
  errorMessage,
  flexProps,
  ...props
}: ImageFileInputProps) => {
  return (
    <FormControl>
      {label && (
        <Flex alignItems="center" justifyContent="flex-start" w="full">
          <FormLabel htmlFor={props?.id} mb="2">
            {label}
          </FormLabel>
        </Flex>
      )}
      <InputGroup>
        <Flex
          border="2px dashed"
          borderColor={errorMessage ? 'red.500' : 'gray.200'}
          borderRadius="6xl"
          h={{ base: '12', md: '60' }}
          justify="center"
          position="relative"
          w="full"
          {...flexProps}
        >
          <Input
            accept="image/*"
            aria-hidden="true"
            cursor="pointer"
            h="full"
            isInvalid={!!errorMessage}
            left="0"
            opacity="0"
            position="absolute"
            top="0"
            type="file"
            zIndex="2"
            {...props}
          />

          {selectedFile !== undefined && preview ? (
            <Image alt="Image upload preview" objectFit="cover" src={preview} />
          ) : (
            <Flex
              align="center"
              flexDir={{ base: 'row', md: 'column' }}
              gap="4"
              h="full"
              justify={{ base: 'space-between', md: 'center' }}
              left="0"
              maxW={{ base: 'none', md: '11.75rem' }}
              mx="auto"
              p={{ base: '4', md: 'auto' }}
              position="relative"
              top="0"
              w="full"
              zIndex="1"
            >
              <ImageIcon
                color="gray.400"
                h={{ base: '6', md: '1.875rem' }}
                w={{ base: '6', md: '1.875rem' }}
              />
              <Show above="md">
                <Text color="gray.400">{ctaText}</Text>
              </Show>
              <Center
                border="1px solid"
                borderColor="gray.200"
                borderRadius="full"
                color="gray.800"
                px={{ base: '3', md: '4' }}
                py={{ base: '1', md: '2' }}
              >
                {buttonText}
              </Center>
            </Flex>
          )}
        </Flex>
      </InputGroup>
      {errorMessage && (
        <Text fontSize={{ base: 'xs', md: 'sm' }} mt="6px" textAlign="left" variant="error">
          {errorMessage}
        </Text>
      )}
    </FormControl>
  );
};
