import { Button, Flex, Input, useDisclosure } from '@chakra-ui/react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { AddIcon } from '@chakra-ui/icons';

import { IconBox } from '@/components/IconBox';
import { FormControl } from '@/components/FormControl';
import { LinkIcon } from '@/components/Icons';
import { useDropFlowContext } from '@/features/create-drop/contexts';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';

import { CreateTicketModal } from './CreateTicketModal';

// const { defaultWallet } = getConfig();

export const CreateEventDropsForm = () => {
  const { account } = useAuthWalletContext();

  const { onNext } = useDropFlowContext();
  const {
    setValue,
    handleSubmit,
    control,
    watch,
    getValues,
    formState: { isDirty, isValid },
  } = useFormContext();

  console.log(watch());

  const {
    fields,
    append,
    remove: removeTicket,
  } = useFieldArray({
    control,
    name: 'tickets',
  });

  const { isOpen, onClose, onOpen } = useDisclosure();

  // const calcTotalCost = async () => {
  //   if (totalLinks && amountPerLink) {
  //     const { requiredDeposit } = await createDrop({
  //       wallet: await window.selector.wallet(),
  //       depositPerUseNEAR: amountPerLink,
  //       numKeys: totalLinks,
  //       returnTransactions: true,
  //     });
  //     setTotalCost(parseFloat(formatNearAmount(requiredDeposit!, 4)));
  //   }
  // };

  // useEffect(() => {
  //   calcTotalCost();
  // }, [amountPerLink, totalLinks]);

  const handleSubmitClick = () => {
    console.log('submit');
  };

  const handleDeleteTicket = (index) => {
    removeTicket(index);
    onClose();
  };

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
            const today = new Date().getDate();
            append({
              name: '',
              description: '',
              salesStartDate: new Date().setDate(today + 1),
              salesEndDate: new Date().setDate(today + 2),
              numberOfTickets: undefined,
            });
            onOpen();
          }}
        >
          Add a ticket
        </Button>

        <Flex justifyContent="flex-end">
          <Button disabled={!isDirty || !isValid} mt="10" type="submit">
            Continue to summary
          </Button>
        </Flex>
      </form>

      <CreateTicketModal
        isOpen={isOpen}
        ticketIndex={0}
        onCancel={() => {
          handleDeleteTicket(fields.length - 1);
        }}
        onClose={onClose}
      />
    </IconBox>
  );
};
