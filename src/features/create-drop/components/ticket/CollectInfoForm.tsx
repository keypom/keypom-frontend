import { Button, HStack, Skeleton, VStack } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { EditIcon } from '@chakra-ui/icons';

import { FormControlComponent } from '@/components/FormControl';
import { type ColumnItem } from '@/components/Table/types';
import { DeleteIcon } from '@/components/Icons';
import { DataTable } from '@/components/Table';
import ToggleSwitch from '@/components/ToggleSwitch/ToggleSwitch';

import {
  type TicketDropFormData,
  type EventStepFormProps,
} from '../../routes/CreateTicketDropPage';

import { ModifyQuestionModal } from './ModifyQuestionModal';

const columns: ColumnItem[] = [
  {
    id: 'question',
    title: 'Question',
    selector: (row) => row.id,
    loadingElement: <Skeleton height="" />,
  },
  {
    id: 'isRequired',
    title: 'Is required?',
    selector: (row) => row.isRequired,
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: 'action',
    title: '',
    selector: (row) => row.action,
    loadingElement: <Skeleton height="30px" />,
  },
];

export const CollectInfoFormValidation = (formData: TicketDropFormData) => {
  const newFormData = { ...formData };
  const isErr = false;

  return { isErr, newFormData };
};

const CollectInfoForm = (props: EventStepFormProps) => {
  const { formData, setFormData } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [originalQuestion, setOriginalQuestion] = useState<string | undefined>();

  const handleDeleteClick = (id) => {
    const newQuestions = formData.questions.filter((item) => item.question !== id);
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleToggle = (id) => {
    const newQuestions = formData.questions.map((item) => {
      if (item.question === id) {
        return { ...item, isRequired: !item.isRequired };
      }
      return item;
    });
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleModalClose = (shouldAdd, originalQuestion) => {
    console.log('originalQuestion', originalQuestion);
    console.log('shouldAdd', shouldAdd);
    if (shouldAdd) {
      let newQuestions = formData.questions;
      if (originalQuestion) {
        newQuestions = newQuestions.map((item) => {
          if (item.question === originalQuestion) {
            return { ...item, question: userInput, isRequired: item.isRequired };
          }
          return item;
        });
      } else {
        newQuestions.push({ question: userInput, isRequired: false });
      }

      console.log('new questions', newQuestions);
      setFormData({ ...formData, questions: newQuestions });
    }

    setIsModalOpen(false);
  };

  const getTableRows = (data, handleToggle, handleDeleteClick) => {
    if (data === undefined) return [];

    return data.map((item: { question: string; isRequired: boolean }) => ({
      id: item.question, // Assuming `item` has a `question` property that can serve as `id`
      isRequired: (
        <ToggleSwitch handleToggle={() => handleToggle(item.question)} toggle={item.isRequired} />
      ),
      action: (
        <HStack>
          <Button
            borderRadius="6xl"
            size="md"
            variant="icon"
            onClick={() => {
              handleDeleteClick(item.question); // Pass the correct id here
            }}
          >
            <DeleteIcon color="red.400" />
          </Button>
          <Button
            borderRadius="6xl"
            size="md"
            variant="icon"
            onClick={() => {
              setOriginalQuestion(item.question);
              setUserInput(item.question);
              setIsModalOpen(true);
            }}
          >
            <EditIcon color="gray.600" height="16px" width="16px" />
          </Button>
        </HStack>
      ),
    }));
  };

  const data = useMemo(
    () => getTableRows(formData.questions, handleToggle, handleDeleteClick),
    [getTableRows, formData.questions],
  );

  return (
    <>
      <ModifyQuestionModal
        isOpen={isModalOpen}
        originalQuestion={originalQuestion}
        setUserInput={setUserInput}
        userInput={userInput}
        onClose={handleModalClose}
      />
      <VStack align="top" justifyContent="space-between">
        <FormControlComponent
          helperText="Select the information you'd like to capture from attendees, or alternatively create your own custom questions"
          label="Collect information (optional)"
        >
          <DataTable
            columns={columns}
            data={data}
            excludeMobileColumns={[]}
            mt={{ base: '6', md: '4' }}
            showColumns={true}
            showMobileTitles={['isRequired']}
            type="collect-info"
          />
        </FormControlComponent>
        <Button
          borderRadius="12px"
          fontSize="sm"
          padding="7px 16px 8px 16px"
          size="md"
          w="168px"
          onClick={() => {
            setOriginalQuestion(undefined);
            setUserInput('');
            setIsModalOpen(true);
          }}
        >
          + Add custom field
        </Button>
      </VStack>
    </>
  );
};

export { CollectInfoForm };
