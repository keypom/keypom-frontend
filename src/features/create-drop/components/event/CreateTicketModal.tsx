import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Textarea,
  Box,
  Flex,
} from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';

import { FormControl } from '@/components/FormControl';
import { DatetimeRangePicker } from '@/components/DatetimeRangePicker/DatetimeRangePicker';
import { TokenInput } from '@/components/TokenInputMenu';

import { ticketSchema, type TicketSchema } from '../../contexts/CreateEventDropsContext';

const quickPrices = [20, 50, 100, 200];
const quickNumberOfTickets = ['10', '30', '50'];

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
  onConfirm: (ticketData: TicketSchema) => void;
  values: TicketSchema;
  confirmText?: string;
}

export const CreateTicketModal = ({
  confirmText = 'Add ticket',
  values,
  isOpen,
  onClose,
  onCancel,
  onConfirm,
}: CreateTicketModalProps) => {
  const {
    control,
    getValues,
    setValue,
    reset,
    watch,
    formState: { isDirty, isValid, errors },
  } = useForm<TicketSchema>({
    mode: 'onChange',
    defaultValues: values,
    resolver: zodResolver(ticketSchema),
  });
  const [isPriceCustom, setIsPriceCustom] = useState(false);

  useEffect(() => {
    reset(values);
  }, [isOpen]);

  const [salesStartDate, salesEndDate, nearPricePerTicket] = watch([
    'salesStartDate',
    'salesEndDate',
    'nearPricePerTicket',
  ]);
  // const [dateRange, setDateRange] = useState([null, null]);
  // const [startDate, endDate] = dateRange;
  // console.log(dateRange);

  console.log(watch());

  return (
    <Modal
      closeOnEsc={false}
      closeOnOverlayClick={false}
      isOpen={isOpen}
      size="lg"
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent p="8" py="0">
        <ModalBody mt="0">
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState: { error } }) => {
              return (
                <FormControl errorText={error?.message} label="Ticket name*">
                  <Input
                    isInvalid={Boolean(error?.message)}
                    placeholder="Name"
                    type="text"
                    {...field}
                  />
                </FormControl>
              );
            }}
          />
          <Controller
            control={control}
            name="description"
            render={({ field }) => {
              return (
                <FormControl
                  errorText=""
                  helperText="Let attendees know what this ticket has to offer, and how it differs from other tickets. "
                  label="Description*"
                >
                  <Textarea
                    // isInvalid={Boolean(error?.message)}
                    placeholder="Add a description"
                    {...field}
                  />
                </FormControl>
              );
            }}
          />
          <FormControl label="Date range">
            <DatetimeRangePicker
              value={[new Date(salesStartDate), new Date(salesEndDate)]}
              onChange={(datetimes: Date[]) => {
                const [start, end] = datetimes;
                setValue('salesStartDate', start.toString(), { shouldValidate: true });
                setValue('salesEndDate', end.toString(), { shouldValidate: true });
              }}
            />
          </FormControl>
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
                    placeholder="Number of tickets"
                    type="number"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(parseInt(e.target.value));
                    }}
                  />
                </FormControl>
              );
            }}
          />
          <FormControl label="Price per ticket (NEAR)*">
            <Flex justifyContent="space-between" w="full">
              {quickPrices.map((val) => (
                <Button
                  key={`quickPrices-${val}`}
                  isActive={nearPricePerTicket === val}
                  size="sm"
                  variant="quick-select"
                  onClick={() => {
                    setIsPriceCustom(false);
                    setValue('nearPricePerTicket', val, { shouldValidate: true });
                  }}
                >
                  {val}
                </Button>
              ))}
              <Button
                size="sm"
                variant="colorful"
                onClick={() => {
                  setIsPriceCustom(true);
                }}
              >
                Custom amount
              </Button>
            </Flex>
          </FormControl>
          {isPriceCustom && (
            <Controller
              control={control}
              name="nearPricePerTicket"
              render={({ field: { value, onChange, name }, fieldState: { error } }) => (
                <FormControl
                  errorText={error?.message}
                  helperText="Amount of NEAR per ticket"
                  label="Price per ticket*"
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
          )}
          {/* <Controller
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
          /> */}
        </ModalBody>

        <ModalFooter>
          <Box w="full">
            <Button
              isDisabled={!isValid}
              w="full"
              onClick={() => {
                onConfirm(watch());
                onClose();
              }}
            >
              {confirmText}
            </Button>
            <Button mt={3} variant="outline" w="full" onClick={onCancel}>
              Cancel
            </Button>
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
