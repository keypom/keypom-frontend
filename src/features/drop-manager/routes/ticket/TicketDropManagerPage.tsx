import { Button, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { CopyIcon, DeleteIcon } from '@/components/Icons';
import { DropManager, type GetDataFn } from '@/features/drop-manager/components/DropManager';
import keypomInstance from '@/lib/keypom';
import { decrypt, encrypt } from '@/utils/crypto';

import { getClaimStatus } from '../../utils/getClaimStatus';
import { getBadgeType } from '../../utils/getBadgeType';
import { ticketTableColumns } from '../../components/TableColumn';

// mock fetch function to fetch from smart contract
const fetchAttendeeInformation = async (
  dropId: string,
  publicKeys: string[], // temporary
  secretKeys: string[], // temporary - this would be encrypted in smart contract already
) => {
  return await new Promise((resolve) => {
    setTimeout(() => {
      const randomAnswers1 = [
        'Andre Hadianto Lesmana',
        'Eric',
        'Matt',
        'Ben',
        'Wahyu',
        'Elon Musk',
      ];
      const randomAnswers2 = [
        'This is awesome',
        'I love Keypom, NEAR and Airfoil!',
        'This event is super cool, i just had to join and experience it',
        'This event is super cool, i love the onboarding process',
        'Onboarding on this app is so smooth and easy',
        'Came to the event to see Keypom and NEAR getting lit!',
        'I love Keypom, NEAR and Airfoil! Onboarding on this app is so smooth and easy',
      ];

      // structure of response
      // resolve({
      //   publicKey1: ["ans1", "ans2"]
      //   publicKey2: ["ans1", "ans2"]
      // });

      const response = publicKeys.reduce((allPKs, currPK, index) => {
        // When user generated their QR, they would have entered their info
        const randomAnswer1 = randomAnswers1[Math.floor(Math.random() * randomAnswers1.length)];
        const randomAnswer2 = randomAnswers2[Math.floor(Math.random() * randomAnswers2.length)];

        console.log({ randomAnswer1, randomAnswer2, secretKeys });
        // data is symmetrically encrypted with their secret key and stored in a smart contract
        const encrypted1 = encrypt(randomAnswer1, secretKeys[index]);
        const encrypted2 = encrypt(randomAnswer2, secretKeys[index]);

        // smart contract would return a list of publicKey -> encryptedInfo based on drop id
        return {
          ...allPKs,
          [currPK]: [encrypted1, encrypted2],
        };
      }, {});

      resolve(response);
    }, 2000);
  });
};

export default function TicketDropManagerPage() {
  const navigate = useNavigate();

  const { id: dropId = '' } = useParams();

  const [scannedAndClaimed, setScannedAndClaimed] = useState<number>(0);

  const getScannedKeys = async () => {
    const keysSupply = await keypomInstance.getAvailableKeys(dropId);
    const drop = await keypomInstance.getDropInfo({ dropId });

    const getScannedInner = async (scanned = 0, index = 0) => {
      const size = 200; // max limit is 306

      if (index * size >= drop.next_key_id) return;

      const keyInfos = await keypomInstance.getKeysForDrop({
        dropId,
        limit: size,
        start: index * size,
      });

      const scannedKeys = keyInfos.filter((key) => getClaimStatus(key) === 'Attended');
      scanned += scannedKeys.length;
      index = index + 1;

      setScannedAndClaimed(keysSupply - scanned);

      getScannedInner(scanned, index);
    };
    getScannedInner();
  };

  // set Scanned item
  useEffect(() => {
    if (dropId === '') navigate('/drops');

    getScannedKeys();
  }, [dropId]);

  const getTableRows: GetDataFn = async (data, handleDeleteClick, handleCopyClick) => {
    if (data === undefined) return [];

    const drop = await keypomInstance.getDropInfo({ dropId });
    const dropMetadata = keypomInstance.getDropMetadata(drop.metadata);

    const allSecretKeys = data.map((item) => item.secretKey);
    const allPublicKeys = data.map((item) => item.publicKey);

    let encryptedData;
    if (dropMetadata.questions) {
      encryptedData = await fetchAttendeeInformation(drop.drop_id, allPublicKeys, allSecretKeys);
    }

    return data.map((item) => {
      // qnaStats only exists if ticket has questions
      let qnaStats;
      if (dropMetadata.questions) {
        const answeredQuestionsLength = encryptedData[item.publicKey].filter(
          (answer) => answer !== undefined,
        ).length as number;
        const questionsLength = dropMetadata.questions.length as number;
        qnaStats = `${answeredQuestionsLength} / ${questionsLength}`;
      }

      return {
        id: item.id,
        dropId,
        dropLink: item.link,
        link: (
          <Text color="gray.400" display="flex">
            {window.location.hostname}/
            <Text as="span" color="gray.800">
              {item.slug}
            </Text>
          </Text>
        ),
        hasClaimed: getBadgeType(item.keyInfo?.cur_key_use as number),
        qnaStats,
        rowPanel:
          encryptedData?.[item.publicKey] &&
          encryptedData[item.publicKey].map((ans, i) => ({
            id: i,
            questions: dropMetadata.questions[i].text,
            answers: decrypt(ans, item.secretKey),
          })),
        action: (
          <>
            <Button
              mr="1"
              size="sm"
              variant="icon"
              onClick={(e) => {
                e.preventDefault();
                handleCopyClick(item.link);
              }}
            >
              <CopyIcon />
            </Button>
            {!item.hasClaimed && (
              <Button
                size="sm"
                variant="icon"
                onClick={async (e) => {
                  e.preventDefault();
                  await handleDeleteClick(item.publicKey);
                }}
              >
                <DeleteIcon color="red" />
              </Button>
            )}
          </>
        ),
      };
    });
  };

  return (
    <DropManager
      claimedHeaderText="Scanned"
      getClaimedText={(dropSize) => `${dropSize - scannedAndClaimed} / ${dropSize}`}
      getData={getTableRows}
      showColumns={false}
      tableColumns={ticketTableColumns}
    />
  );
}
