import {
  Center,
  Flex,
  FlexProps,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputProps,
  Text,
  VStack,
  Image,
} from '@chakra-ui/react';

import { ImageIcon } from '../Icons';

interface FileInputProps extends InputProps {
  label: string;
  selectedFile: File;
  preview: string;
  errorMessage?: string;
  flexProps?: FlexProps;
}

export const FileInput = ({
  label,
  selectedFile,
  preview,
  errorMessage,
  flexProps,
  ...props
}: FileInputProps) => {
  return (
    <FormControl>
      <Flex alignItems="center" justifyContent="flex-start" w="full">
        <FormLabel htmlFor={props.id || undefined} mb="2">
          {label}
        </FormLabel>
      </Flex>
      <InputGroup>
        <Flex
          border="2px dashed"
          borderColor="gray.200"
          borderRadius="6xl"
          h="60"
          justify="center"
          position="relative"
          w="full"
          {...flexProps}
        >
          <Input
            accept="image/*"
            aria-hidden="true"
            cursor="pointer"
            h="60"
            isInvalid={!!errorMessage}
            left="0"
            opacity="0"
            position="absolute"
            top="0"
            type="file"
            zIndex="2"
            {...props}
          />

          {selectedFile && preview ? (
            <Image alt="NFT preview" objectFit="cover" src={preview} />
          ) : (
            <VStack
              h="full"
              justify="center"
              left="0"
              maxW="11.75rem"
              mx="auto"
              position="relative"
              spacing="4"
              top="0"
              w="full"
              zIndex="1"
            >
              <>
                <ImageIcon color="gray.400" h="1.875rem" w="1.875rem" />
                <Text color="gray.400" lineHeight="1.5rem">
                  Browse or drag and drop your image here
                </Text>
                <Center
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="full"
                  color="gray.800"
                  px="4"
                  py="2"
                >
                  Browse images
                </Center>
              </>
            </VStack>
          )}
        </Flex>
      </InputGroup>
    </FormControl>
  );
};
