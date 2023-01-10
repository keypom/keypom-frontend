import {
  Flex,
  FormControl,
  FormLabel,
  InputGroup,
  Textarea,
  TextareaProps,
} from '@chakra-ui/react';

interface TextAreaInputProps extends TextareaProps {
  label: string;
  errorMessage?: string;
}

export const TextAreaInput = ({ label, errorMessage, ...props }: TextAreaInputProps) => {
  return (
    <FormControl>
      <Flex alignItems="center" justifyContent="flex-start" w="full">
        <FormLabel htmlFor={props.id || undefined} mb="2">
          {label}
        </FormLabel>
      </Flex>
      <InputGroup>
        <Textarea isInvalid={!!errorMessage} type="text" {...props} />
      </InputGroup>
    </FormControl>
  );
};
