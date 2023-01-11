import { Control, Controller } from 'react-hook-form';
import { useState, useEffect } from 'react';

import { ImageFileInput } from '@/common/components/ImageFileInput';

import { CreateNftDropFormFieldTypes } from '../CreateNftDropForm';

interface ArtworkInputProps {
  control: Control<CreateNftDropFormFieldTypes, any>;
}

const FIELD_NAME = 'artwork';

export const ArtworkInput = ({ control }: ArtworkInputProps) => {
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState<string>();

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile[0]);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

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
      name={FIELD_NAME}
      render={(
        { field: { onChange, value, ...props }, fieldState: { error } }, //value is unused to prevent `onChange` from updating it
      ) => (
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
      )}
    />
  );
};
