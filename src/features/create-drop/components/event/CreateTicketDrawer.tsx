import {
  Button,
  Heading,
  Input,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Textarea,
} from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';

import { FormControl } from '@/components/FormControl';
import { TokenInput } from '@/components/TokenInputMenu';

import { ticketSchema, type TicketSchema } from '../../contexts/CreateEventDropsContext';

interface CreateTicketDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
  onConfirm: (ticketData: TicketSchema) => void;
  values: TicketSchema;
}

export const CreateTicketDrawer = ({
  values,
  isOpen,
  onClose,
  onCancel,
  onConfirm,
}: CreateTicketDrawerProps) => {
  const {
    control,
    getValues,
    reset,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm<TicketSchema>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      salesStartDate: '',
      salesEndDate: '',
      nearPricePerTicket: undefined,
      numberOfTickets: undefined,
    },
    resolver: zodResolver(ticketSchema),
  });

  useEffect(() => {
    reset(values);
  }, [isOpen]);

  return (
    <Drawer
      closeOnEsc={false}
      closeOnOverlayClick={false}
      isOpen={isOpen}
      size="lg"
      onClose={onClose}
    >
      <DrawerOverlay />
      <DrawerContent p="14" pb="8">
        <DrawerHeader>
          <Heading size="sm">Add a new ticket type</Heading>
        </DrawerHeader>
        <DrawerBody>
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState: { error } }) => {
              return (
                <FormControl errorText={error?.message} label="Ticket name">
                  <Input
                    isInvalid={Boolean(error?.message)}
                    placeholder="Early bird admission"
                    type="text"
                    {...field}
                  />
                </FormControl>
              );
            }}
          />
          <Controller
            control={control}
            name="numberOfTickets"
            render={({ field, fieldState: { error } }) => {
              return (
                <FormControl
                  errorText={error?.message}
                  helperText="Leave empty if the party can host infinite number of guests"
                  label="Number of tickets"
                >
                  <Input
                    isInvalid={Boolean(error?.message)}
                    placeholder="50"
                    type="number"
                    {...field}
                  />
                </FormControl>
              );
            }}
          />
          <Controller
            control={control}
            name="nearPricePerTicket"
            render={({ field: { value, onChange, name }, fieldState: { error } }) => (
              <FormControl
                errorText={error?.message}
                helperText="Amount of NEAR per ticket"
                label="Ticket price"
              >
                <TokenInput
                  isInvalid={Boolean(error?.message)}
                  maxLength={14}
                  name={name}
                  value={value}
                  onChange={(e) => {
                    if (e.target.value.length > e.target.maxLength)
                      e.target.value = e.target.value.slice(0, e.target.maxLength);
                    onChange(e.target.value);
                  }}
                />
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="description"
            render={({ field }) => {
              return (
                <FormControl
                  errorText=""
                  helperText="Let attendees know what this ticket has to offer "
                  label="Description"
                >
                  <Textarea
                    // isInvalid={Boolean(error?.message)}
                    placeholder="Get exclusive plushie when you buy an early bird ticket"
                    {...field}
                  />
                </FormControl>
              );
            }}
          />
          <Controller
            control={control}
            name="salesStartDate"
            render={({ field, fieldState: { error } }) => {
              return (
                <FormControl
                  errorText={error?.message}
                  isInvalid={Boolean(error?.message)}
                  label="Sales start date"
                >
                  <Input
                    type="datetime-local"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                  />
                </FormControl>
              );
            }}
          />

          <Controller
            control={control}
            name="salesEndDate"
            render={({ field, fieldState: { error } }) => {
              return (
                <FormControl
                  errorText={error?.message}
                  isInvalid={Boolean(error?.message)}
                  label="Sales end date"
                >
                  <Input placeholder={new Date().toString()} type="datetime-local" {...field} />
                </FormControl>
              );
            }}
          />
        </DrawerBody>

        <DrawerFooter>
          <Button mr={3} variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            isDisabled={!isDirty || !isValid}
            onClick={() => {
              console.log(getValues());
              onConfirm(getValues());
              onClose();
            }}
          >
            Confirm
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
