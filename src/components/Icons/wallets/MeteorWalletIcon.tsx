import { Icon, type IconProps } from '@chakra-ui/react';
import meteorIcon from './meteor-icon.png'

export const MeterWalletIcon = ({ ...props }: IconProps) => {
  return (
    <Icon h="8" viewBox="0 0 411 411" w="8" xmlns="http://www.w3.org/2000/svg" {...props}>
      <image height="90%" href={meteorIcon} width="90%" x="-5"/>
    </Icon>
  );

};
