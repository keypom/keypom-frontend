import { Switch, Box } from '@chakra-ui/react';

function ToggleSwitch({
  toggle,
  handleToggle,
}: {
  toggle: boolean;
  handleToggle: (a: any) => void;
}) {
  return (
    <Box alignItems="center" display="flex" height="24px" justifyContent="center">
      <Switch
        colorScheme="blue" // This is the color scheme for the switch
        isChecked={toggle}
        size="md" // You can adjust the size e.g., "md", "lg"
        onChange={handleToggle}
      />
    </Box>
  );
}

export default ToggleSwitch;
