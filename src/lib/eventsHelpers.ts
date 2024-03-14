import { type TicketInfoFormMetadata } from '@/features/create-drop/components/ticket/CreateTicketsForm';

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

export interface EventDropMetadata extends TicketInfoMetadata {
  dropName: string;
  eventId: string;
}

export interface TicketInfoMetadata {
  name: string;
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
  console.log('ticketInfo', ticketInfo);
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

const FIRST_DROP_BASE_COST = BigInt('15899999999999900000000');
const SUBSEQUENT_DROP_BASE_COST = BigInt('14460000000000200000000');
const FUNDER_METADATA_BASE_COST = BigInt('840000000000000000000');
const FIRST_MARKET_DROP_BASE_COST = BigInt('11790000000000000000000');
const SUBSEQUENT_MARKET_DROP_BASE_COST = BigInt('6810000000000000000000');
const YOCTO_PER_BYTE = BigInt('12500000000000000000'); // Includes a 200% safety margin

const BASE_MARKET_BYTES_PER_KEY = BigInt('750');
const METADATA_MARKET_BYTES_PER_KEY = BigInt('512');

export function getByteSize(str: string) {
  return new Blob([str]).size;
}

export const calculateDepositCost = ({
  eventMetadata,
  eventTickets,
  marketTicketInfo,
}: {
  eventMetadata: FunderEventMetadata;
  eventTickets: TicketInfoFormMetadata[];
  marketTicketInfo: Record<
    string,
    { max_tickets: number; price: string; sale_start?: number; sale_end?: number }
  >;
}) => {
  let marketDeposit = FIRST_MARKET_DROP_BASE_COST;
  let dropDeposit = FIRST_DROP_BASE_COST;
  let funderMetaCost = FUNDER_METADATA_BASE_COST;

  // Calculate drop deposit
  dropDeposit += BigInt(eventTickets.length - 1) * SUBSEQUENT_DROP_BASE_COST;
  dropDeposit += BigInt(getByteSize(JSON.stringify(eventTickets))) * YOCTO_PER_BYTE;

  // Calculate funder metadata cost
  funderMetaCost += BigInt(getByteSize(JSON.stringify(eventMetadata))) * YOCTO_PER_BYTE;

  // Initialize market deposit
  marketDeposit +=
    BigInt(Object.keys(marketTicketInfo).length - 1) * SUBSEQUENT_MARKET_DROP_BASE_COST;

  let numFreeKeys = 0; // Initialize numFreeKeys as a number
  for (const keyInfo of Object.values(marketTicketInfo)) {
    if (keyInfo.price === '0') {
      numFreeKeys += keyInfo.max_tickets; // Ensure max_tickets is a number
    }
  }

  // Calculate market key cost for free keys (if any)
  marketDeposit +=
    BigInt(numFreeKeys) *
    (BASE_MARKET_BYTES_PER_KEY + METADATA_MARKET_BYTES_PER_KEY) *
    YOCTO_PER_BYTE;

  // Return the total deposit cost
  return {
    marketDeposit: marketDeposit.toString(),
    dropDeposit: (dropDeposit + funderMetaCost).toString(),
    costBreakdown: {
      perDrop: (dropDeposit / BigInt(eventTickets.length)).toString(),
      perEvent: funderMetaCost.toString(),
      marketListing: marketDeposit.toString(),
      total: (dropDeposit + funderMetaCost + marketDeposit).toString(),
    },
  };
};
