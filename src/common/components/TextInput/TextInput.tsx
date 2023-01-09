import { Flex, FormControl, FormLabel, Input, InputGroup, InputProps } from '@chakra-ui/react';

interface TextInputProps extends InputProps {
  label: string;
  errorMessage?: string;
}

export const TextInput = ({ label, errorMessage, ...props }: TextInputProps) => {
  return (
    <FormControl>
      <Flex alignItems="center" justifyContent="flex-start" w="full">
        <FormLabel htmlFor={props.id || undefined} mb="2">
          {label}
        </FormLabel>
      </Flex>
      <InputGroup>
        <Input isInvalid={!!errorMessage} type="text" {...props} />
      </InputGroup>
    </FormControl>
  );
};
