import { AddIcon, CheckIcon, CloseIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormLabel,
  IconButton,
  Switch,
  Text,
  useEditableControls,
} from '@chakra-ui/react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { FormControl } from '@/components/FormControl';
import { Checkbox } from '@/components/Checkbox/Checkbox';

export const EventQuestionsForm = () => {
  const {
    setValue,
    handleSubmit,
    control,
    watch,
    getValues,
    formState: { isDirty, isValid, errors },
  } = useFormContext();

  const {
    fields: questionsFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: 'questions',
  });

  return (
    <>
      <FormControl
        helperText="Select which information you'd lke to capture from attendees, or alternatively create your own custom questions."
        label="Collect information (optional)"
      >
        <Box mt="4">
          <Flex justifyContent="space-between">
            <FormLabel>Question</FormLabel>
            <FormLabel mr="0">Is required?</FormLabel>
          </Flex>
          {questionsFields.map((question, index: number) => {
            const id = questionsFields?.[index]?.id;
            return (
              // <Flex
              //   key={id}
              //   alignItems="center"
              //   id={id}
              //   justifyContent="space-between"
              //   mb="2"
              //   w="full"
              // >
              //   <Box>
              //     <Checkbox />
              //     {question.text}
              //   </Box>
              //   <Switch />
              // </Flex>
              <Flex key={id} alignItems="center" justifyContent="space-between">
                <Checkbox isChecked={false} p="0" pl="0" py="2" value={false}>
                  <Text ml="2">{question.text}</Text>
                </Checkbox>
                <Switch />
              </Flex>
            );
          })}
        </Box>
      </FormControl>
      <Box textAlign="left">
        <Button
          iconSpacing="3"
          leftIcon={<AddIcon h="3" />}
          mt="2"
          variant="outline"
          onClick={() => {
            appendQuestion({ text: 'new question', type: 'TEXT' });
          }}
        >
          Add question
        </Button>
      </Box>
    </>
  );
};

const EditableControls = ({ removeQuestion }: { removeQuestion: (i: number) => void }) => {
  const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } =
    useEditableControls();

  return isEditing ? (
    <ButtonGroup alignItems="center" justifyContent="center" size="sm">
      <IconButton aria-label="submit" icon={<CheckIcon />} {...getSubmitButtonProps()} />
      <IconButton aria-label="cancel" icon={<CloseIcon />} {...getCancelButtonProps()} />
    </ButtonGroup>
  ) : (
    <Flex gap="2" justifyContent="center">
      <IconButton aria-label="edit" icon={<EditIcon />} size="sm" {...getEditButtonProps()} />
      <IconButton aria-label="edit" icon={<DeleteIcon />} size="sm" onClick={removeQuestion} />
    </Flex>
  );
};
