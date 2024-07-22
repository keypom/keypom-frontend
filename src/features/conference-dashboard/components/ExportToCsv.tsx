import { type EventDrop } from '@/lib/eventsHelpers';
import { type AttendeeKeyItem } from '@/lib/keypom';
import { EventData } from '../routes/SponsorDashboardPage';
import { CLAIM_STATUS } from '@/features/drop-manager/routes/ticket/TicketDropManagerPage';

export const handleExportCSVClick = async ({
  dropIds,
  setExporting,
  keypomInstance,
  eventData,
}: {
  dropIds: string[];
  setExporting: any;
  keypomInstance: any;
  eventData?: EventData;
}) => {
  if (dropIds.length > 0) {
    setExporting(true);
    for (let i = 0; i < dropIds.length; i++) {
      const dropId = dropIds[i];
      const {
        dropInfo,
        dropKeyItems: data,
      }: { dropInfo: EventDrop; dropKeyItems: AttendeeKeyItem[] } =
        await keypomInstance.getAllKeysForTicket({
          dropId,
        });

      try {
        // Construct CSV header
        const questions = eventData?.questions || [];

        let csvContent = 'data:text/csv;charset=utf-8,';
        csvContent +=
          'Ticket ID,' + 'Claim Status,' + questions.map((q) => q.question).join(',') + '\r\n';

        // Construct CSV rows
        await Promise.all(
          data.map(async (item, i) => {
            const row = [item.pub_key.split('ed25519:')[1]];
            row.push(CLAIM_STATUS[item.uses_remaining].name);
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
          `${(eventData?.name || '')
            .toLowerCase()
            .replaceAll(' ', '_')}-${dropInfo.drop_config.nft_keys_config.token_metadata.title
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
