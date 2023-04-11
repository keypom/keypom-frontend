import keypomInstance from '@/lib/keypom';

export const isEventDrop = async ({ dropId }: { dropId: string }) => {
  const drop = await keypomInstance.getDropInfo({ dropId });
  const { eventId } = keypomInstance.getDropMetadata(drop.metadata);

  if (eventId !== undefined) return true; // eventId metadata only exists in event drop
  return false;
};
