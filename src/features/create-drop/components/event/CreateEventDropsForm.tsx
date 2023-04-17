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
import { LinkIcon } from '@/components/Icons';
import { useDropFlowContext } from '@/features/create-drop/contexts';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { TicketCard } from '@/features/create-drop/components/TicketCard/TicketCard';

import { CreateTicketDrawer } from './CreateTicketDrawer';

// const { defaultWallet } = getConfig();

export const CreateEventDropsForm = () => {
  const [totalCost, setTotalCost] = useState(0);
  const [totalLinks, setTotalLinks] = useState(0);
  const [modalTicketIndex, setTicketIndex] = useState<number>(0);
  const [modalAction, setModalAction] = useState('create');
  const { onNext } = useDropFlowContext();
  const { account } = useAuthWalletContext();
  const {
    setValue,
    handleSubmit,
    control,
    watch,
    getValues,
    formState: { isDirty, isValid },
  } = useFormContext();

  const {
    fields: ticketFields,
    append: appendTicket,
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

  const [tickets, questions] = watch(['tickets', 'questions']);

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
    <IconBox
      icon={<LinkIcon h={{ base: '7', md: '9' }} />}
      maxW={{ base: '21.5rem', md: '36rem' }}
      mx="auto"
    >
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
            appendTicket({
              name: 'Test ticket ',
              description: 'this is an awesome event',
              salesStartDate: '2023-04-01T00:00',
              salesEndDate: '2023-04-28T00:00',
              nearPricePerTicket: '1.5',
              numberOfTickets: '10',
            });
            setModalAction('create');
            setTicketIndex(ticketFields.length);
            onOpen();
          }}
        >
          Add a ticket
        </Button>

        <FormControl
          helperText="add questions to your ticket to collect information from attendees"
          label="Collect attendees info"
        >
          {questions.map((question, index: number) => {
            const id = ticketFields?.[index]?.id;
            return (
              <Flex key={id} alignItems="center" id={id} justifyContent="center" mb="2" w="full">
                <Text w="20px">{index + 1}.</Text>
                <Editable
                  // defaultValue="Enter your email"
                  // fontSize="sm"
                  isPreviewFocusable={false}
                  value={question.text}
                  width="full"
                >
                  <Flex alignContent="center" justifyContent="space-between">
                    <Box>
                      <EditablePreview />
                      <Controller
                        control={control}
                        name={`questions.${index}.text`}
                        render={({ field, fieldState: { error } }) => {
                          console.log(field);
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
                    <EditableControls />
                  </Flex>
                </Editable>
              </Flex>
            );
          })}
          {/* <Flex alignItems="center" justifyContent="center" mb="2" w="full">
            <Text w="20px">1.</Text>
            <Editable
              defaultValue="Enter your email"
              // fontSize="sm"
              isPreviewFocusable={false}
              width="full"
            >
              <Flex alignContent="center" justifyContent="space-between">
                <Box>
                  <EditablePreview />
                  <Input as={EditableInput} />
                </Box>
                <EditableControls />
              </Flex>
            </Editable>
          </Flex> */}
          {/* <Flex alignItems="center" justifyContent="center" w="full">
            <Text w="20px">2.</Text>
            <Editable
              defaultValue="How did you find out about us?"
              // fontSize="sm"
              isPreviewFocusable={false}
              width="full"
            >
              <Flex alignContent="center" justifyContent="space-between">
                <Box>
                  <EditablePreview />
                  <Input as={EditableInput} />
                </Box>
                <EditableControls />
              </Flex>
            </Editable>
          </Flex> */}
        </FormControl>

        <Box mt="10">
          {tickets.map((ticket, index) => (
            <TicketCard
              key={ticketFields?.[index]?.id}
              id={ticketFields?.[index]?.id}
              ticket={ticket}
              onEditClick={() => {
                setTicketIndex(index);
                setModalAction('update');
                onOpen();
              }}
              onRemoveClick={() => {
                removeTicket(index);
              }}
            />
          ))}
        </Box>

        <Flex justifyContent="flex-end">
          <Button
            disabled={ticketFields.length === 0 || !isDirty || !isValid}
            mt="10"
            type="submit"
          >
            Continue to summary
          </Button>
        </Flex>
      </form>

      <CreateTicketDrawer
        isOpen={isOpen}
        ticketIndex={modalTicketIndex}
        onCancel={() => {
          if (modalAction === 'create') {
            removeTicket(modalTicketIndex);
          }
          window.setTimeout(() => {
            onClose();
          }, 0);
        }}
        onClose={onClose}
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

const EditableControls = () => {
  const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } =
    useEditableControls();

  return isEditing ? (
    <ButtonGroup alignItems="center" justifyContent="center" size="sm">
      <IconButton icon={<CheckIcon />} {...getSubmitButtonProps()} />
      <IconButton icon={<CloseIcon />} {...getCancelButtonProps()} />
    </ButtonGroup>
  ) : (
    <Flex justifyContent="center">
      <IconButton icon={<EditIcon />} size="sm" {...getEditButtonProps()} />
    </Flex>
  );
};
