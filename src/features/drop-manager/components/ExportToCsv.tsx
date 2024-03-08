import { type EventDropMetadata } from '@/lib/eventsHelpers';
import { type AttendeeKeyItem } from '@/lib/keypom';

import { type EventData } from '../routes/events/EventManagerPage';
import { CLAIM_STATUS } from '../routes/ticket/TicketDropManagerPage';

export const handleExportCSVClick = async ({
  dropIds,
  setExporting,
  keypomInstance,
  setIsCorrectMasterKey,
  userKey,
  eventData,
}: {
  dropIds: string[];
  setExporting: any;
  keypomInstance: any;
  setIsCorrectMasterKey: any;
  userKey?: string;
  eventData?: EventData;
}) => {
  if (dropIds.length > 0) {
    setExporting(true);
    for (let i = 0; i < dropIds.length; i++) {
      const dropId = dropIds[i];
      const {
        dropMeta,
        dropKeyItems: data,
      }: { dropMeta: EventDropMetadata; dropKeyItems: AttendeeKeyItem[] } =
        await keypomInstance.getAllKeysForTicket({
          dropId,
        });

      try {
        console.log('data', data);
        console.log('dropMeta', dropMeta);
        console.log('eventData', eventData);
        console.log('userKey', userKey);
        // Construct CSV header
        const questions = eventData?.questions || [];
        if (questions.length !== 0) {
          if (!userKey) {
            setIsCorrectMasterKey(false);
            return;
          }
        }
        let csvContent = 'data:text/csv;charset=utf-8,';
        csvContent +=
          'Ticket ID,' + 'Claim Status,' + questions.map((q) => q.question).join(',') + '\r\n';

        // Construct CSV rows
        await Promise.all(
          data.map(async (item, i) => {
            const row = [item.pub_key.split('ed25519:')[1]];
            row.push(CLAIM_STATUS[item.uses_remaining].name);
            if (userKey) {
              const decryptedMeta = await keypomInstance.decryptMetadata({
                data: item.metadata,
                privKey: userKey,
              });
              const responses = JSON.parse(decryptedMeta).questions || {};
              // Add answers in the same order as the questions
              questions.forEach((q) => {
                row.push(responses[q.question] || '-');
              });
            }
            // Join the individual row's columns and push it to CSV content
            csvContent += row.join(',') + '\r\n';
          }),
        );

        // Encode the CSV content
        const encodedUri = encodeURI(csvContent);

        // Create a link to download the CSV file
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute(
          'download',
          `${(eventData?.name || '').toLowerCase().replaceAll(' ', '_')}-${dropMeta.name
            .toLowerCase()
            .replaceAll(' ', '_')}.csv`,
        );
        document.body.appendChild(link); // Required for FF

        link.click(); // This will download the CSV file
        document.body.removeChild(link); // Clean up
      } catch (e) {
        console.error('error', e);
      } finally {
        setExporting(false);
      }
    }
  }
};
