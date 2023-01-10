import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputProps,
  Text,
} from '@chakra-ui/react';

interface TextInputProps extends InputProps {
  label: string;
  topLeftHelperMessage?: string;
  errorMessage?: string;
}

export const TextInput = ({
  label,
  topLeftHelperMessage,
  errorMessage,
  ...props
}: TextInputProps) => {
  const haveTopHelperText = !!topLeftHelperMessage;
  return (
    <FormControl>
      <Flex alignItems="center" justifyContent="flex-start" w="full">
        <FormLabel htmlFor={props.id || undefined} mb={haveTopHelperText ? '0.5' : '2'}>
          {label}
        </FormLabel>
      </Flex>
      {topLeftHelperMessage && (
        <Flex alignItems="center" justifyContent="flex-start" w="full">
          <Text color="gray.600" lineHeight="1.5rem" mb="2">
            {topLeftHelperMessage}
          </Text>
        </Flex>
      )}
      <InputGroup>
        <Input isInvalid={!!errorMessage} type="text" {...props} />
      </InputGroup>
    </FormControl>
  );
};
