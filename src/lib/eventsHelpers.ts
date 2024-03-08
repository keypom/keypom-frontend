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

export interface FunderEventMetadata {
  // Stage 1
  name: string;
  id: string;
  description: string;
  location: string;
  date: EventDateInfo;
  artwork: string;
  dateCreated: string;

  // Stage 2
  questions?: QuestionInfo[];

  // If there are some questions, then we need to encrypt the answers
  pubKey?: string;
  encPrivKey?: string;
  iv?: string;
  salt?: string;
}

export interface EventDropMetadata {
  dropName: string;
  name: string;
  eventId: string;
  description: string;
  salesValidThrough: string;
  passValidThrough: string;
  price: string;
  artwork: string;
  maxSupply?: number;
}

/// Maps UUID to Event Metadata
export type FunderMetadata = Record<string, FunderEventMetadata>;

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
