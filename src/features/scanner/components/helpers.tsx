import { DateTime } from 'luxon';
import { getPubFromSecret } from '@keypom/core';

import {
  type TicketMetadataExtra,
  type DateAndTimeInfo,
  type EventDrop,
} from '@/lib/eventsHelpers';
import keypomInstance from '@/lib/keypom';
import { dateAndTimeToText } from '@/features/drop-manager/utils/parseDates';

export const getDropFromSecretKey = async (
  secretKey: string,
): Promise<{ drop: EventDrop; usesRemaining: number } | null> => {
  try {
    const pubKey = getPubFromSecret(secretKey);
    const keyInfo: { drop_id: string; uses_remaining: number } = await keypomInstance.viewCall({
      methodName: 'get_key_information',
      args: { key: pubKey },
    });
    const drop: EventDrop = await keypomInstance.viewCall({
      methodName: 'get_drop_information',
      args: { drop_id: keyInfo.drop_id },
    });
    return { usesRemaining: keyInfo.uses_remaining, drop };
  } catch (e) {
    return null;
  }
};

export const getTimeAsMinutes = (timeString) => {
  // Assuming the format is 'h:mm a', e.g., '9:00 AM'
  const time = DateTime.fromFormat(timeString, 'h:mm a');
  return time.hour * 60 + (time.minute as number);
};

export const validateDateAndTime = (
  requiredDateAndTime: DateAndTimeInfo,
  checkEventOver = false,
): { valid: boolean; message: string } => {
  let message = '';
  let valid = true;

  const requiredInfo = requiredDateAndTime.valueOf();
  if (typeof requiredInfo === 'object') {
    const requiredInfoObj = requiredInfo as DateAndTimeInfo;

    const { valid: startValid, message: startMessage } = validateStartDateAndTime(requiredInfoObj);
    console.log('START DATE: ', requiredInfoObj);
    console.log('START VALID: ', startValid);
    console.log('START MESSAGE: ', startMessage);

    if (!startValid) {
      /// If we're checking for event over, we only need to verify that the single day events haven't closed
      if (checkEventOver) {
        if (startMessage === `Ticket sales have closed`) {
          valid = false;
          message = startMessage;
        }
      } /// Otherwise, we should just set the valid normally since it wasn't valid
      else {
        valid = false;
        message = startMessage;
      }
    }

    const { valid: endValid, message: endMessage } = validateEndDateAndTime(requiredInfoObj);
    if (!endValid) {
      message = endMessage;
      valid = false;
    }
  }
  return { valid, message };
};

const validateStartDateAndTime = (
  requiredDateAndTime: DateAndTimeInfo,
): { valid: boolean; message: string } => {
  // Get the current DateTime
  const now = DateTime.now();
  const nowDateOnly = now.startOf('day');

  // Normalize the start and end dates to midnight for date comparisons
  const requiredStartDate = DateTime.fromMillis(requiredDateAndTime.startDate).startOf('day');

  // Check the date range first
  if (nowDateOnly < requiredStartDate) {
    return { valid: false, message: `Ticket sales open ${dateAndTimeToText(requiredDateAndTime)}` };
  }

  // If it's the start date, check the start time
  if (nowDateOnly.equals(requiredStartDate) && requiredDateAndTime.startTime) {
    const startTimeMinutes = getTimeAsMinutes(requiredDateAndTime.startTime);
    const currentMinutes = now.hour * 60 + (now.minute as number);
    if (currentMinutes < startTimeMinutes) {
      return {
        valid: false,
        message: `Ticket sales open ${dateAndTimeToText(requiredDateAndTime)}`,
      };
    }
  }

  // If it's the start date, check the end time (only if it's a 1 day ticket)
  if (
    nowDateOnly.equals(requiredStartDate) &&
    requiredDateAndTime.endTime &&
    requiredDateAndTime.endDate === undefined
  ) {
    const endTimeMinutes = getTimeAsMinutes(requiredDateAndTime.endTime);
    const currentMinutes = now.hour * 60 + (now.minute as number);
    if (currentMinutes > endTimeMinutes) {
      return {
        valid: false,
        message: `Ticket sales have closed`,
      };
    }
  }

  return {
    valid: true,
    message: ``,
  };
};

const validateEndDateAndTime = (
  requiredDateAndTime: DateAndTimeInfo,
): { valid: boolean; message: string } => {
  // Get the current DateTime
  const now = DateTime.now();
  const nowDateOnly = now.startOf('day');

  // Normalize the start and end dates to midnight for date comparisons
  const requiredEndDate = requiredDateAndTime.endDate
    ? DateTime.fromMillis(requiredDateAndTime.endDate).endOf('day') // Use end of the day for end date
    : null;

  // Check the date range first
  if (requiredEndDate && nowDateOnly > requiredEndDate) {
    return { valid: false, message: `Ticket sales have closed` };
  }

  // If it's the end date, check the end time
  if (
    requiredEndDate &&
    nowDateOnly.equals(requiredEndDate.startOf('day')) &&
    requiredDateAndTime.endTime
  ) {
    const endTimeMinutes = getTimeAsMinutes(requiredDateAndTime.endTime);
    const currentMinutes = now.hour * 60 + (now.minute as number);
    console.log('END TIME MINUTES: ', endTimeMinutes);
    if (currentMinutes > endTimeMinutes) {
      return { valid: false, message: `Ticket sales have closed` };
    }
  }

  return { valid: true, message: `` };
};

interface ValidateDropProps {
  drop: EventDrop;
  allTicketOptions: EventDrop[];
  ticketToVerify: string;
}
export const validateDrop = ({
  drop,
  allTicketOptions,
  ticketToVerify,
}: ValidateDropProps): { status: 'success' | 'error'; message: string } => {
  try {
    const dropId = drop.drop_id;
    const ticketExtra: TicketMetadataExtra = JSON.parse(
      drop.drop_config.nft_keys_config.token_metadata.extra,
    );
    const requiredDateAndTime: DateAndTimeInfo = ticketExtra.passValidThrough;
    const isDropValid = validateDateAndTime(requiredDateAndTime);
    if (!isDropValid.valid) {
      return { status: 'error', message: isDropValid.message };
    }

    // Check if the drop ID is one of the event tickets
    const isEventTicket = allTicketOptions.find((option) => option.drop_id === dropId);
    if (dropId === '' || !isEventTicket) {
      return { status: 'error', message: 'Ticket does not exist for this event.' };
    }

    // Check if the ticket is the correct type
    if (ticketToVerify === '') {
      return { status: 'success', message: 'Ticket is valid.' };
    }

    if (ticketToVerify !== dropId) {
      return {
        status: 'error',
        message: 'Ticket does not match the selected ticket type but is valid for the event.',
      };
    }

    return { status: 'success', message: 'Ticket is valid.' };
  } catch (e) {
    console.error(e);
    return { status: 'error', message: 'Invalid Ticket' };
  }
};
