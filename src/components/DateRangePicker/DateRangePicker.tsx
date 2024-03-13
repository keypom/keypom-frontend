/** at the top of your component file */
import { Button, HStack, Input, Text, VStack } from '@chakra-ui/react';
import type React from 'react';
import { useState } from 'react';
import { format, parse } from 'date-fns';
import DatePicker from 'react-datepicker';

interface CustomFooterProps {
  startTime: string | undefined;
  startTimeError: boolean;
  endTime: string | undefined;
  endTimeError: boolean;
  onChangeStartTime: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeEndTime: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlurStartTime: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlurEndTime: (e: React.FocusEvent<HTMLInputElement>) => void;
  onApplyClick: () => void;
  onCancelClick: () => void;
}

const CustomFooter = ({
  startTime,
  startTimeError,
  endTime,
  endTimeError,
  onChangeStartTime,
  onChangeEndTime,
  onBlurStartTime,
  onBlurEndTime,
  onApplyClick,
  onCancelClick,
}: CustomFooterProps) => (
  <HStack
    align="flex-end"
    backgroundColor="#fdfdfd"
    borderRadius="0.3rem"
    justifyContent="space-between"
  >
    <HStack p={3} w="50%">
      <VStack align="left" spacing={1} w="50%">
        <Text color="gray.800" fontWeight="bold">
          Start time
        </Text>
        <Input
          borderColor="gray.300"
          isInvalid={startTimeError}
          placeholder="00:00 AM"
          sx={{
            '::placeholder': {
              color: 'gray.400', // Placeholder text color
            },
          }}
          value={startTime || ''}
          onBlur={onBlurStartTime}
          onChange={onChangeStartTime}
        />
      </VStack>
      <VStack align="left" spacing={1} w="50%">
        <Text color="gray.800" fontWeight="bold">
          End time
        </Text>
        <Input
          borderColor="gray.300"
          isInvalid={endTimeError}
          placeholder="00:00 AM"
          sx={{
            '::placeholder': {
              color: 'gray.400', // Placeholder text color
            },
          }}
          value={endTime || ''}
          onBlur={onBlurEndTime}
          onChange={onChangeEndTime}
        />
      </VStack>
    </HStack>
    <HStack p={3} w="50%">
      <Button
        height="48px"
        lineHeight=""
        px="6"
        variant="secondary"
        width="50%"
        onClick={onCancelClick}
      >
        Cancel
      </Button>
      <Button
        height="48px"
        isDisabled={startTimeError || endTimeError}
        lineHeight=""
        px="6"
        variant="primary"
        width="50%"
        onClick={onApplyClick}
      >
        Apply
      </Button>
    </HStack>
  </HStack>
);

const checkAndSetTime = (inputValue, setTimeText, setIsErr) => {
  // If the input is empty, reset the error state and the time
  if (!inputValue) {
    setTimeText('');
    setIsErr(false);
    return;
  }

  // Check if the input value matches the time format HH:MM AM/PM
  const isValidTime = /^(1[0-2]|0?[1-9]):[0-5][0-9] [AP]M$/;

  if (isValidTime.test(inputValue)) {
    try {
      // Parse the time using date-fns or similar library
      const parsedTime = parse(inputValue, 'hh:mm aa', new Date());
      // Format and set the valid time
      setTimeText(format(parsedTime, 'hh:mm aa'));
      setIsErr(false);
    } catch (error) {
      // If parsing fails, set an error state
      console.error('Error parsing time:', error);
      setIsErr(true);
    }
  } else {
    // If the regex test fails, set an error state
    setIsErr(true);
  }
};

interface CustomDateRangePickerProps {
  onDateChange: (startDate: Date, endDate: Date) => void;
  onTimeChange: (startTime: string | undefined, endTime: string | undefined) => void;
  isDatePickerOpen: boolean;
  setIsDatePickerOpen: (isOpen: boolean) => void;
  ctaComponent?: React.ReactNode;
  startDate: Date | null;
  endDate: Date | null;
  startTime?: string;
  endTime?: string;
  openDirection?: string;
}

function CustomDateRangePicker({
  startDate,
  endDate,
  startTime,
  endTime,
  onDateChange,
  onTimeChange,
  ctaComponent,
  isDatePickerOpen,
  setIsDatePickerOpen,
  openDirection = 'top-start',
}: CustomDateRangePickerProps) {
  const [startTimeText, setStartTimeText] = useState<string | undefined>();
  const [startTimeError, setStartTimeError] = useState(false);
  const [endTimeText, setEndTimeText] = useState<string | undefined>();
  const [endTimeError, setEndTimeError] = useState(false);

  // handle changes inside date picker
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    onDateChange(start, end);
  };

  const handleApplyClick = () => {
    setIsDatePickerOpen(false);
    onTimeChange(startTimeText, endTimeText);
  };

  const handleCancelClick = () => {
    setIsDatePickerOpen(false);
  };

  const onChangeStartTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartTimeText(e.target.value);
  };

  const onChangeEndTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndTimeText(e.target.value);
  };

  const onBlurStartTime = (e) => {
    checkAndSetTime(e.target.value, setStartTimeText, setStartTimeError);
  };

  const onBlurEndTime = (e) => {
    checkAndSetTime(e.target.value, setEndTimeText, setEndTimeError);
  };

  return (
    <>
      <DatePicker
        selectsRange
        showTimeInput
        customTimeInput={
          <CustomFooter
            endTime={endTimeText}
            endTimeError={endTimeError}
            startTime={startTimeText}
            startTimeError={startTimeError}
            onApplyClick={handleApplyClick}
            onBlurEndTime={onBlurEndTime}
            onBlurStartTime={onBlurStartTime}
            onCancelClick={handleCancelClick}
            onChangeEndTime={onChangeEndTime}
            onChangeStartTime={onChangeStartTime}
          />
        }
        dateFormat="MM/dd/yyyy h:mm aa"
        endDate={endDate}
        minDate={new Date()}
        monthsShown={2}
        open={isDatePickerOpen}
        popperPlacement={openDirection}
        startDate={startDate}
        onCalendarClose={() => {
          setIsDatePickerOpen(false);
        }}
        onChange={handleDateChange}
      />
      {ctaComponent}
    </>
  );
}

export default CustomDateRangePicker;
