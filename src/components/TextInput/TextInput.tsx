import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  type InputProps,
  Text,
  InputLeftAddon,
  InputRightAddon,
} from '@chakra-ui/react';

interface TextInputProps extends InputProps {
  label: string;
  topLeftHelperMessage?: string;
  errorMessage?: string;
  leftAddOnText?: string;
  rightAddOnText?: string;
}

export const TextInput = ({
  label,
  topLeftHelperMessage,
  errorMessage,
  leftAddOnText,
  rightAddOnText,
  ...props
}: TextInputProps) => {
  const haveTopHelperText = !!topLeftHelperMessage;

  return (
    <FormControl>
      <Flex alignItems="center" justifyContent="flex-start" w="full">
        <FormLabel htmlFor={props?.id} mb={haveTopHelperText ? '0.5' : '2'}>
          {label}
        </FormLabel>
      </Flex>
      {topLeftHelperMessage && (
        <Flex alignItems="center" justifyContent="flex-start" w="full">
          <Text color="gray.600" mb="2">
            {topLeftHelperMessage}
          </Text>
        </Flex>
      )}
      <InputGroup>
        {leftAddOnText && <InputLeftAddon>{leftAddOnText}</InputLeftAddon>}
        <Input isInvalid={!!errorMessage} type="text" {...props} />
        {rightAddOnText && <InputRightAddon>{rightAddOnText}</InputRightAddon>}
      </InputGroup>
      {errorMessage && (
        <Text fontSize={{ base: 'xs', md: 'sm' }} textAlign="left" variant="error">
          {errorMessage}
        </Text>
      )}
    </FormControl>
  );
};
