/** at the top of your component file */
import { Button, HStack, Text, VStack } from '@chakra-ui/react';
import type React from 'react';
import { useState } from 'react';
import DatePicker from 'react-datepicker';

import { TimeInput } from '../TimeInput/TimeInput';

import { canClose, checkAndSetTime } from './helpers';

interface CustomFooterProps {
  startTime: string | undefined;
  startTimeError: boolean;
  endTime: string | undefined;
  endTimeError: boolean;
  canClose: boolean;
  onChangeStartTime: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeEndTime: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlurStartTime: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlurEndTime: (e: React.FocusEvent<HTMLInputElement>) => void;
  onApplyClick: () => void;
  onResetClick: () => void;
}

const CustomFooter = ({
  startTime,
  startTimeError,
  endTime,
  endTimeError,
  canClose,
  onChangeStartTime,
  onChangeEndTime,
  onBlurStartTime,
  onBlurEndTime,
  onApplyClick,
  onResetClick,
}: CustomFooterProps) => (
  <HStack
    align="flex-end"
    backgroundColor="#fdfdfd"
    borderRadius="0.3rem"
    justifyContent="space-between"
  >
    <HStack p={3} w="50%">
      {/* Start Time Section */}
      <VStack align="left" spacing={1} w="50%">
        <Text color="gray.800" fontWeight="bold">
          Start Time
        </Text>
        <TimeInput
          isInvalid={startTimeError}
          placeholder="10:00 AM"
          value={startTime || ''}
          onBlur={onBlurStartTime}
          onChange={onChangeStartTime}
        />
      </VStack>

      {/* End Time Section */}
      <VStack align="left" spacing={1} w="50%">
        <Text color="gray.800" fontWeight="bold">
          End Time
        </Text>
        <TimeInput
          isInvalid={endTimeError}
          placeholder="6:00 PM"
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
        onClick={onResetClick}
      >
        Reset
      </Button>
      <Button
        height="48px"
        isDisabled={!canClose}
        lineHeight=""
        px="6"
        variant="primary"
        width="50%"
        onClick={onApplyClick}
      >
        Done
      </Button>
    </HStack>
  </HStack>
);

interface CustomDateRangePickerProps {
  onDateChange: (startDate: number, endDate: number | undefined) => void;
  onTimeChange: (startTime: string | undefined, endTime: string | undefined) => void;
  isDatePickerOpen: boolean;
  setIsDatePickerOpen: (isOpen: boolean) => void;
  ctaComponent?: React.ReactNode;
  startDate: number;
  endDate?: number;
  minDate: Date | null;
  maxDate: Date | null;
  openDirection?: string;
  scale?: string;
}

function CustomDateRangePicker({
  startDate,
  endDate,
  onDateChange,
  onTimeChange,
  ctaComponent,
  isDatePickerOpen,
  setIsDatePickerOpen,
  minDate,
  maxDate,
  scale = '1',
  openDirection = 'top-start',
}: CustomDateRangePickerProps) {
  const [startTimeText, setStartTimeText] = useState<string | undefined>();
  const [startTimeError, setStartTimeError] = useState(false);
  const [endTimeText, setEndTimeText] = useState<string | undefined>();
  const [endTimeError, setEndTimeError] = useState(false);

  // handle changes inside date picker
  const handleDateChange = (dates) => {
    const [start, end] = dates;

    if (!start) {
      return;
    }
    onDateChange(start.getTime(), end ? end.getTime() : undefined);
  };

  const handleApplyClick = () => {
    if (startTimeError || endTimeError) {
      return;
    }
    setIsDatePickerOpen(false);
    onTimeChange(startTimeText, endTimeText);
  };

  const handleResetClick = () => {
    setStartTimeError(false);
    setEndTimeError(false);
    setStartTimeText(undefined);
    setEndTimeText(undefined);
    onDateChange(0, undefined);
  };

  const onChangeStartTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartTimeText(e.target.value.toUpperCase());
  };

  const onChangeEndTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndTimeText(e.target.value.toUpperCase());
  };

  const onBlurStartTime = (e) => {
    checkAndSetTime(e.target.value, setStartTimeText, setStartTimeError);
  };

  const onBlurEndTime = (e) => {
    checkAndSetTime(e.target.value, setEndTimeText, setEndTimeError);
  };

  return (
    <>
      <div
        style={{
          transform: scale === '1' ? undefined : `scale(${scale})`,
          transformOrigin: 'top right',
          zIndex: 1000,
          height: 0,
        }}
      >
        <DatePicker
          selectsRange
          showTimeInput
          customTimeInput={
            <CustomFooter
              canClose={canClose(
                startDate,
                endDate,
                startTimeText,
                endTimeText,
                startTimeError,
                endTimeError,
              )}
              endTime={endTimeText}
              endTimeError={endTimeError}
              startTime={startTimeText}
              startTimeError={startTimeError}
              onApplyClick={handleApplyClick}
              onBlurEndTime={onBlurEndTime}
              onBlurStartTime={onBlurStartTime}
              onChangeEndTime={onChangeEndTime}
              onChangeStartTime={onChangeStartTime}
              onResetClick={handleResetClick}
            />
          }
          dateFormat="MM/dd/yyyy h:mm aa"
          endDate={endDate ? new Date(endDate) : null}
          maxDate={maxDate}
          minDate={minDate || new Date()}
          monthsShown={2}
          open={isDatePickerOpen}
          popperPlacement={openDirection}
          startDate={startDate ? new Date(startDate) : null}
          onCalendarClose={() => {
            setIsDatePickerOpen(false);
          }}
          onChange={handleDateChange}
        />
      </div>
      {ctaComponent}
    </>
  );
}

export default CustomDateRangePicker;
