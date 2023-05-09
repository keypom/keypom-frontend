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
  ButtonGroup,
} from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';

import { FormControl } from '@/components/FormControl';
import { TokenInput } from '@/components/TokenInputMenu';
import { DatetimeRangePicker } from '@/components/DatetimeRangePicker/DatetimeRangePicker';

import { ticketSchema, type TicketSchema } from '../../contexts/CreateEventDropsContext';

const quickPrices = ['0.5', '1.5', '3.0', '5.0', '10.0'];
const quickNumberOfTickets = ['10', '30', '50'];

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
    setValue,
    reset,
    watch,
    formState: { isDirty, isValid },
  } = useForm<TicketSchema>({
    mode: 'onChange',
    defaultValues: values,
    resolver: zodResolver(ticketSchema),
  });

  useEffect(() => {
    reset(values);
  }, [isOpen]);

  const [salesStartDate, salesEndDate] = watch(['salesStartDate', 'salesEndDate']);
  // const [dateRange, setDateRange] = useState([null, null]);
  // const [startDate, endDate] = dateRange;
  // console.log(dateRange);

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
          <ButtonGroup spacing="2">
            {quickNumberOfTickets.map((val) => (
              <Button
                key={`quickNumOfTicket-${val}`}
                size="sm"
                variant="outline"
                onClick={() => {
                  console.log(val);
                  setValue('numberOfTickets', val);
                }}
              >
                {val}
              </Button>
            ))}
          </ButtonGroup>
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
          <ButtonGroup spacing="2">
            {quickPrices.map((val) => (
              <Button
                key={`quickPrices-${val}`}
                size="sm"
                variant="outline"
                onClick={() => {
                  setValue('nearPricePerTicket', val);
                }}
              >
                {val}
              </Button>
            ))}
          </ButtonGroup>
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
          <FormControl label="Sales period">
            <DatetimeRangePicker
              onChange={(datetimes) => {
                console.log({ datetimes });
                console.log(JSON.stringify(datetimes));
              }}
            />
          </FormControl>
        </DrawerBody>

        <DrawerFooter>
          <Button mr={3} variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            isDisabled={!isValid}
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
