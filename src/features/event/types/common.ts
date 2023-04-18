import { type ProtocolReturnedDrop } from 'keypom-js';

export interface EventMetadata extends Partial<ProtocolReturnedDrop> {
  eventId: string;
  eventName: string;
  dropName: string;
}

export type EventCardMetadata = EventMetadata[];
