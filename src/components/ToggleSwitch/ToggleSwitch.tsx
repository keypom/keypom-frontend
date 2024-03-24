import { Switch, Box } from '@chakra-ui/react';

function ToggleSwitch({
  toggle,
  handleToggle,
  disabled = false,
  size = 'md',
}: {
  toggle: boolean;
  handleToggle: (a: any) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <Box alignItems="center" display="flex" height="24px" justifyContent="center">
      <Switch
        colorScheme="blue" // This is the color scheme for the switch
        disabled={disabled}
        isChecked={toggle}
        size={size}
        onChange={handleToggle}
      />
    </Box>
  );
}

export default ToggleSwitch;
