import { Controller, useFormContext } from 'react-hook-form';
import { useState, useEffect } from 'react';

import { ImageFileInput } from '@/components/ImageFileInput';
import { type CreateNftDropFormFieldTypes } from '@/features/create-drop/components/nft/CreateNftDropForm';
import { type CreateTicketFieldsSchema } from '@/features/create-drop/contexts/CreateTicketDropContext/CreateTicketDropContext';

type CreateDropFieldTypes = CreateNftDropFormFieldTypes | CreateTicketFieldsSchema;
interface ArtworkInputProps {
  name?: 'artwork' | 'additionalGift.poapNft.artwork';
}

const FIELD_NAME = 'artwork';

export const ArtworkInput = ({ name = FIELD_NAME }: ArtworkInputProps) => {
  const { control, trigger } = useFormContext<CreateDropFieldTypes>();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState<string>();

  useEffect(() => {
    if (selectedFile === undefined) {
      setPreview(undefined);
      return;
    }
    void trigger(name); // manually validate
    const objectUrl = URL.createObjectURL(selectedFile[0]);
    setPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile, trigger, name]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    setSelectedFile(e.target.files);
  };

  return (
    <Controller
      control={control}
      name={name}
      render={(
        { field: { onChange, value, ...props }, fieldState: { error } }, // value is unused to prevent `onChange` from updating it
      ) => {
        if (value === null) {
          setSelectedFile(undefined);
        }
        return (
          <ImageFileInput
            accept=" image/jpeg, image/png, image/webp"
            errorMessage={error?.message}
            isInvalid={!!error?.message}
            label="Artwork"
            preview={preview}
            selectedFile={selectedFile}
            onChange={(e) => {
              onSelectFile(e);
              onChange(e.target.files);
            }}
            {...props}
          />
        );
      }}
    />
  );
};
