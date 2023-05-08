import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  type InputProps,
  Text,
  Box,
} from '@chakra-ui/react';

interface TextInputProps extends InputProps {
  label: string;
  topLeftHelperMessage?: string;
  bottomRightHelperMessage?: string;
  errorMessage?: string;
}

export const TextInput = ({
  label,
  topLeftHelperMessage,
  bottomRightHelperMessage,
  errorMessage,
  ...props
}: TextInputProps) => {
  const haveTopHelperText = !!topLeftHelperMessage;
  const haveBottomRightHelperText = !!bottomRightHelperMessage;
  return (
    <FormControl>
      <Flex alignItems="center" justifyContent="flex-start" w="full">
        <FormLabel htmlFor={props?.id} mb={haveTopHelperText ? '0.5' : '2'}>
          {label}
        </FormLabel>
      </Flex>
      {haveTopHelperText && (
        <Flex alignItems="center" justifyContent="flex-start" w="full">
          <Text color="gray.600" mb="2">
            {topLeftHelperMessage}
          </Text>
        </Flex>
      )}
      <InputGroup>
        <Input isInvalid={!!errorMessage} type="text" {...props} />
      </InputGroup>
      <Flex direction={{ base: 'column', md: 'row' }} gap="1" justifyContent="space-between">
        <Box>
          {errorMessage && (
            <Text fontSize={{ base: 'xs', md: 'sm' }} mt="6px" textAlign="left" variant="error">
              {errorMessage}
            </Text>
          )}
        </Box>
        <Box>
          {haveBottomRightHelperText && (
            <Text fontSize={{ base: 'xs', md: 'sm' }} mt="6px" textAlign="right">
              {bottomRightHelperMessage}
            </Text>
          )}
        </Box>
      </Flex>
    </FormControl>
  );
};
