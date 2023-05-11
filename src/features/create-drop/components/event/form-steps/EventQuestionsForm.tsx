import { FormControl } from "@/components/FormControl";

export const EventQuestionsForm = () => {
  const {
    setValue,
    handleSubmit,
    control,
    watch,
    getValues,
    formState: { isDirty, isValid, errors },
  } = useFormContext();
  const currentStep = formSteps[currentIndex];

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
        helperText="add questions to your ticket to collect information from attendees"
        label="Collect attendees info"
      >
        {questionsFields.map((question, index: number) => {
          const id = questionsFields?.[index]?.id;
          return (
            <Flex key={id} alignItems="center" id={id} justifyContent="center" mb="2" w="full">
              <Text w="20px">{index + 1}.</Text>
              <Editable isPreviewFocusable={false} value={question.text} width="full">
                <Flex alignContent="center" justifyContent="space-between">
                  <Box>
                    <EditablePreview />
                    <Controller
                      control={control}
                      name={`questions.${index}.text`}
                      render={({ field, fieldState: { error } }) => {
                        return (
                          <Input
                            as={EditableInput}
                            isInvalid={Boolean(error?.message)}
                            placeholder="Enter your name"
                            type="text"
                            {...field}
                          />
                        );
                      }}
                    />
                  </Box>
                  <EditableControls
                    removeQuestion={() => {
                      removeQuestion(index);
                    }}
                  />
                </Flex>
              </Editable>
            </Flex>
          );
        })}
      </FormCon>
      <Button
        leftIcon={<AddIcon />}
        mt="2"
        variant="outline"
        width="full"
        onClick={() => {
          appendQuestion({ text: 'new question', type: 'TEXT' });
        }}
      >
        Add questions
      </Button>
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
