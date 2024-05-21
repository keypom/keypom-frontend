import type React from 'react';
import { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import { Input } from '@chakra-ui/react';

interface TimeInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  isInvalid: boolean;
  placeholder: string;
}

export const TimeInput = ({ value, onChange, onBlur, isInvalid, placeholder }: TimeInputProps) => {
  const [mask, setMask] = useState('9|');

  useEffect(() => {
    // Check if the second character is a colon
    if (value.length === 2) {
      if (value[1] === ':') {
        setMask('9:99 ??'); // Change the mask to "9:99 ??"
      } else {
        setMask('99:99 ??'); // Default mask
      }
    }
    if (value.length < 2) {
      setMask('9|'); // Default mask
    }
  }, [value]); // Depend on value to re-evaluate when it changes

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur(e); // Call the parent component's onBlur for validation
  };

  return (
    <InputMask
      formatChars={{
        '9': '[0-9]',
        '?': '[AaPpMm]', // Allow typing A, a, P, p, M, m
        '|': '[0-9:]', // Allow typing A, a, P, p, M, m
      }}
      mask={mask}
      maskChar={null} // Do not use any mask character
      placeholder={placeholder}
      value={value}
      onBlur={handleBlur}
      onChange={onChange} // Pass the change event directly to the parent handler
    >
      {(inputProps) => (
        <Input
          {...inputProps}
          isInvalid={isInvalid}
          sx={{
            '::placeholder': {
              color: 'gray.400', // Placeholder text color
            },
          }}
        />
      )}
    </InputMask>
  );
};
