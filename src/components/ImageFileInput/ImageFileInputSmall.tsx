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

interface ImageFileInputSmallProps extends InputProps {
  label?: string;
  ctaText?: string;
  buttonText?: string;
  selectedFile?: File;
  preview?: string;
  errorMessage?: string;
  flexProps?: FlexProps;
}

export const ImageFileInputSmall = ({
  label,
  ctaText = 'Browse or drag and drop your image here',
  buttonText = 'Browse images',
  selectedFile,
  preview,
  errorMessage,
  flexProps,
  ...props
}: ImageFileInputSmallProps) => {
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
          h={{ base: '20' }}
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
            onClick={(e) => {
              // console.log('File input clicked');
            }}
            {...props}
          />

          {selectedFile !== undefined && preview ? (
            <Image alt="Image upload preview" objectFit="cover" src={preview} />
          ) : (
            <Flex
              align="center"
              flexDir="row"
              gap="4"
              h="full"
              justify={{ base: 'space-between' }}
              left="0"
              mx="auto"
              p="4"
              position="relative"
              top="0"
              w="full"
              zIndex="1"
            >
              <ImageIcon color="gray.400" h={{ base: '6' }} w={{ base: '6' }} />
              <Show above="md">
                <Text color="gray.400">{ctaText}</Text>
              </Show>
              <Center
                border="1px solid"
                borderColor="gray.200"
                borderRadius="6xl"
                color="gray.800"
                px={{ base: '3' }}
                py={{ base: '1' }}
              >
                {buttonText}
              </Center>
            </Flex>
          )}
        </Flex>
      </InputGroup>
      {errorMessage && (
        <Text fontSize={{ base: 'xs' }} mt="6px" textAlign="left" variant="error">
          {errorMessage}
        </Text>
      )}
    </FormControl>
  );
};
