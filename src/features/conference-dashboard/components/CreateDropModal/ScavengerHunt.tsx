import { VStack, Button, Input, Text, HStack, Tooltip, Switch } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import {
  updateScavengerPieceDescription,
  addScavengerPiece,
  removeScavengerPiece,
  updateNumPieces,
  isValidNonNegativeNumber,
} from './dropUtils';
import { useState } from 'react';

export const ScavengerHunt = ({
  isScavengerHunt,
  setIsScavengerHunt,
  scavengerPieces,
  setScavengerPieces,
  errors,
}) => {
  const [numPiecesError, setNumPiecesError] = useState('');
  const [tempNumPieces, setTempNumPieces] = useState('2');

  const handleNumPiecesChange = (e) => {
    const value = e.target.value;
    if (isValidNonNegativeNumber(value) || value === '') {
      setTempNumPieces(value);
    }
  };

  return (
    <>
      <HStack justify="space-between" my="4">
        <Tooltip label="Scavenger hunts require users to collect all the pieces before the reward is given.">
          <HStack spacing={4}>
            <Text>Make it a Scavenger Hunt!</Text>
            <Switch
              id="scavenger-hunt"
              isChecked={isScavengerHunt}
              onChange={() => {
                setIsScavengerHunt(!isScavengerHunt);
              }}
            />
          </HStack>
        </Tooltip>
        {isScavengerHunt && (
          <HStack justify="flex-end" spacing={4}>
            <Text>Num Pieces</Text>
            <Input
              type="text"
              value={tempNumPieces}
              w="25%"
              onBlur={() => {
                updateNumPieces(
                  tempNumPieces,
                  setNumPiecesError,
                  setScavengerPieces,
                  setTempNumPieces,
                );
              }}
              onChange={handleNumPiecesChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateNumPieces(
                    tempNumPieces,
                    setNumPiecesError,
                    setScavengerPieces,
                    setTempNumPieces,
                  );
                }
              }}
            />
          </HStack>
        )}
      </HStack>
      {numPiecesError && (
        <Text color="red.500" fontSize="sm" marginBottom={4}>
          {numPiecesError}
        </Text>
      )}
      {isScavengerHunt && (
        <>
          <VStack align="stretch" spacing={4}>
            {scavengerPieces.map((piece, index) => (
              <VStack key={index} alignItems="flex-start" w="100%">
                <Text>{piece.piece}</Text>
                <HStack alignItems="center" spacing={4} w="100%">
                  <Input
                    placeholder="Description"
                    value={piece.description}
                    onChange={(e) =>
                      updateScavengerPieceDescription(
                        index,
                        e.target.value,
                        scavengerPieces,
                        setScavengerPieces,
                      )
                    }
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      removeScavengerPiece(
                        index,
                        scavengerPieces,
                        setScavengerPieces,
                        setTempNumPieces,
                      );
                    }}
                    isDisabled={scavengerPieces.length <= 2}
                  >
                    <DeleteIcon />
                  </Button>
                </HStack>
              </VStack>
            ))}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                addScavengerPiece(scavengerPieces, setScavengerPieces, setTempNumPieces);
              }}
              isDisabled={scavengerPieces.length >= 10}
            >
              Add Piece
            </Button>
          </VStack>
        </>
      )}
    </>
  );
};
