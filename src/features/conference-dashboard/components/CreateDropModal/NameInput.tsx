import { FormControlComponent } from '@/components/FormControl';
import { Input } from '@chakra-ui/react';

export const NameInput = ({ createdDrop, setCreatedDrop, errors, setErrors }) => (
  <FormControlComponent
    errorText={errors.name}
    label="Name*"
    labelProps={{ fontSize: { base: 'xs', md: 'md' } }}
    my="1"
  >
    <Input
      borderRadius="5xl"
      height="35px"
      isInvalid={!!errors.name}
      maxLength={500}
      placeholder="My Awesome Drop"
      size="sm"
      sx={{
        '::placeholder': {
          color: 'gray.400',
          fontSize: { base: 'xs', md: 'sm' },
        },
      }}
      type="text"
      value={createdDrop.name}
      onChange={(e) => {
        setErrors({ ...errors, name: '' });
        setCreatedDrop({ ...createdDrop, name: e.target.value });
      }}
    />
  </FormControlComponent>
);
