export const isValidNonNegativeNumber = (value: string) => /^\d*\.?\d+$/.test(value);

export const validateForm = (
  createdDrop: any,
  setErrors: React.Dispatch<React.SetStateAction<any>>,
) => {
  const errors: any = {};
  if (!createdDrop.name) errors.name = 'Name is required';
  if (!createdDrop.artwork) errors.artwork = 'Artwork is required';

  if (createdDrop.nftData) {
    if (!createdDrop.nftData.title) errors.nft = { ...errors.nft, title: 'NFT title is required' };
    if (!createdDrop.nftData.description)
      errors.nft = { ...errors.nft, description: 'NFT description is required' };
    if (!createdDrop.nftData.media)
      errors.nft = { ...errors.nft, media: 'NFT artwork is required' };
  }

  setErrors(errors);
  return Object.keys(errors).length === 0;
};

export const updateScavengerPieceDescription = (
  index: number,
  value: string,
  createdDrop: any,
  setCreatedDrop: React.Dispatch<React.SetStateAction<any>>,
) => {
  const newPieces = [...createdDrop.scavengerPieces];
  newPieces[index].description = value;
  setCreatedDrop({ ...createdDrop, scavengerPieces: newPieces });
};

export const addScavengerPiece = (scavengerPieces, setScavengerPieces, setTempNumPieces) => {
  if (scavengerPieces.length < 10) {
    const newPiece = { piece: `Piece ${scavengerPieces.length + 1}`, description: '' };
    setScavengerPieces([...scavengerPieces, newPiece]);
    setTempNumPieces((scavengerPieces.length + 1).toString());
  }
};

export const updateNumPieces = (
  tempNumPieces,
  setNumPiecesError,
  setScavengerPieces,
  setTempNumPieces,
) => {
  let numPieces = parseInt(tempNumPieces, 10);
  if (isNaN(numPieces) || numPieces < 2) {
    setNumPiecesError('Scavenger hunts need to have at least 2 pieces.');
    numPieces = 2; // Minimum 2 pieces if scavenger hunt is active
  } else {
    setNumPiecesError('');
  }

  if (numPieces <= 10) {
    const newPieces = Array.from({ length: numPieces }, (_, i) => ({
      piece: `Piece ${i + 1}`,
      description: '',
    }));
    setScavengerPieces(newPieces);
    setTempNumPieces(numPieces.toString());
  }
};

export const removeScavengerPiece = (
  index,
  scavengerPieces,
  setScavengerPieces,
  setTempNumPieces,
) => {
  if (scavengerPieces.length > 2) {
    // Ensure there's always at least 2 pieces
    let newPieces = scavengerPieces.filter((_, i) => i !== index);

    // Reassign piece numbers to ensure they are sequential
    newPieces = newPieces.map((piece, i) => ({
      ...piece,
      piece: `Piece ${i + 1}`,
    }));

    setScavengerPieces(newPieces);
    setTempNumPieces(newPieces.length.toString());
  }
};
