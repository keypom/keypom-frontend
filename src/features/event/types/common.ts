export interface EventMetadata extends Record<string, any> {
  eventId: string;
  eventName: string;
  dropName: string;
}

export type EventCardMetadata = EventMetadata[];
