import {
  Box,
  Button,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
  Input,
  Text,
  useDisclosure,
  useEditableControls,
} from '@chakra-ui/react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { AddIcon, CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';

import { IconBox } from '@/components/IconBox';
import { FormControl } from '@/components/FormControl';
import { DeleteIcon, EventIcon } from '@/components/Icons';
import { useDropFlowContext } from '@/features/create-drop/contexts';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { TicketCard } from '@/features/create-drop/components/TicketCard/TicketCard';
import { type TicketSchema } from '@/features/create-drop/contexts/CreateEventDropsContext';
import { CreateTicketModal } from '@/features/create-drop/components/event/CreateTicketModal';

// const { defaultWallet } = getConfig();

const defaultTicketValues: TicketSchema = {
  name: '',
  description: '',
  salesStartDate: '',
  salesEndDate: '',
  nearPricePerTicket: undefined,
  numberOfTickets: undefined,
};

export const CreateEventDropsForm = () => {
  const [totalCost, setTotalCost] = useState(0);
  const [totalLinks, setTotalLinks] = useState(0);
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0);
  const [modalAction, setModalAction] = useState('create');
  const { onNext } = useDropFlowContext();
  const { account } = useAuthWalletContext();
  const {
    setValue,
    handleSubmit,
    control,
    watch,
    getValues,
    formState: { isDirty, isValid, errors },
  } = useFormContext();

  const {
    fields: ticketFields,
    append: appendTicket,
    update: updateTicket,
    remove: removeTicket,
  } = useFieldArray({
    control,
    name: 'tickets',
  });

  const {
    fields: questionsFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: 'questions',
  });

  const { isOpen, onClose, onOpen } = useDisclosure();

  const calcTotalCost = async () => {
    setTotalCost(0);
    // calculate all drops cost in this event
  };

  useEffect(() => {
    calcTotalCost();
  }, [totalLinks]);

  const handleSubmitClick = (data) => {
    onNext?.();
  };

  const handleConfirmTicket = (ticketData) => {
    if (modalAction === 'create') {
      appendTicket(ticketData);
      return;
    }

    updateTicket(currentTicketIndex, ticketData);
  };

  // const getEstimatedCost = async () => {
  //   await Promise.all(
  //     tickets.map(async () => {
  //       const { requiredDeposit } = await createDrop({
  //         wallet: await window.selector.wallet(),
  //         depositPerUseNEAR: amountPerLink,
  //         numKeys: totalLinks,
  //         returnTransactions: true,
  //       });
  //     }),
  //   );
  // };

  return (
    <IconBox icon={<EventIcon />} maxW={{ base: '21.5rem', md: '36rem' }} mx="auto">
      <form onSubmit={handleSubmit(handleSubmitClick)}>
        <Controller
          control={control}
          name="eventName"
          render={({ field, fieldState: { error } }) => {
            return (
              <FormControl errorText={error?.message} label="Event name">
                <Input
                  isInvalid={Boolean(error?.message)}
                  placeholder="NEARCon 2023"
                  type="text"
                  {...field}
                />
              </FormControl>
            );
          }}
        />

        <Button
          leftIcon={<AddIcon />}
          w="full"
          onClick={() => {
            setModalAction('create');
            onOpen();
          }}
        >
          Add a ticket
        </Button>

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
        </FormControl>
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

        <Box mt="10">
          {ticketFields.map((ticket, index) => (
            <TicketCard
              key={ticketFields?.[index]?.id}
              id={ticketFields?.[index]?.id}
              ticket={ticket}
              onEditClick={() => {
                setModalAction('update');
                setCurrentTicketIndex(index);
                window.setTimeout(() => {
                  onOpen();
                }, 0);
              }}
              onRemoveClick={() => {
                removeTicket(index);
              }}
            />
          ))}
        </Box>

        <Flex justifyContent="flex-end">
          <Button
            isDisabled={ticketFields.length === 0 || !isDirty || !isValid}
            mt="10"
            type="submit"
          >
            Continue to summary
          </Button>
        </Flex>
      </form>

      <CreateTicketModal
        confirmText={modalAction === 'create' ? 'Add ticket' : 'Save changes'}
        isOpen={isOpen}
        values={modalAction === 'create' ? defaultTicketValues : ticketFields[currentTicketIndex]}
        onCancel={() => {
          if (modalAction === 'create') {
            removeTicket(ticketFields.length);
          }
          window.setTimeout(() => {
            onClose();
          }, 0);
        }}
        onClose={onClose}
        onConfirm={handleConfirmTicket}
      />
    </IconBox>
  );
};

/**
 * drop metadata
 * --------------
 * event id, event name, drop name, wallets
 * event id: 'drop name - event id'
 */

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
