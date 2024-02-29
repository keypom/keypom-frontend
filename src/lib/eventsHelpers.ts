type AllDayEvent = string;
interface MultiDayEvent {
  from: string;
  to: string;
}
interface EventDateInfo {
  time?: string;
  date: AllDayEvent | MultiDayEvent;
}

export interface QuestionInfo {
  required: boolean;
  question: string;
}

export interface EventInfo {
  // Stage 1
  name: string;
  id: string;
  description: string;
  location: string;
  date: EventDateInfo;
  artwork: string;

  // Stage 2
  questions?: QuestionInfo[];
}

interface TicketInfo {
  name: string;
  eventId: string;
  description: string;
  salesValidThrough: string;
  passValidThrough: string;
  price: string;
  artwork: string;
  maxSupply?: number;
}

export interface EventDropMetadata {
  dropName: string;
  dateCreated: string;
  ticketInfo: TicketInfo;
  eventInfo?: EventInfo;
}

function isValidDateInfo(dateInfo) {
  // Check if date is a string (AllDayEvent)
  if (typeof dateInfo.date === 'string') {
    return true; // Valid AllDayEvent
  }
  // Check if date is a MultiDayEvent with valid from and to strings
  else if (
    typeof dateInfo.date === 'object' &&
    typeof dateInfo.date.from === 'string' &&
    typeof dateInfo.date.to === 'string'
  ) {
    return true; // Valid MultiDayEvent
  }
  return false; // Invalid date format
}

function isValidQuestionInfo(questionInfo) {
  return typeof questionInfo.required === 'boolean' && typeof questionInfo.question === 'string';
}

export function isValidEventInfo(eventInfo) {
  // Check basic properties
  const isValidBasicInfo =
    typeof eventInfo.name === 'string' &&
    typeof eventInfo.id === 'string' &&
    typeof eventInfo.description === 'string' &&
    typeof eventInfo.location === 'string' &&
    typeof eventInfo.artwork === 'string' &&
    isValidDateInfo(eventInfo.date);

  if (!isValidBasicInfo) return false;

  // If questions are provided, check them
  if (eventInfo.questions) {
    for (const question of eventInfo.questions) {
      if (!isValidQuestionInfo(question)) {
        return false; // Invalid question info found
      }
    }
  }

  return true; // All checks passed
}

export function isValidTicketInfo(ticketInfo) {
  // Check if all required properties exist and are of type 'string'
  return (
    typeof ticketInfo.name === 'string' &&
    typeof ticketInfo.eventId === 'string' &&
    typeof ticketInfo.description === 'string' &&
    typeof ticketInfo.salesValidThrough === 'string' &&
    typeof ticketInfo.passValidThrough === 'string' &&
    typeof ticketInfo.price === 'string' &&
    typeof ticketInfo.artwork === 'string'
  );
}
