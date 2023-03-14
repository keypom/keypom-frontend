import { Icon, type IconProps } from '@chakra-ui/react';

interface TrialAppButtonIconProps extends IconProps {
  media: string;
}

export const TrialAppButtonIcon = ({ media, ...props }: TrialAppButtonIconProps) => {
  console.log('media: ', media);
  const uniqueId = Math.ceil(Math.random() * 1000); // prevent reusing of svg that aren't visible on page
  return (
    <Icon
      fill="none"
      height="7"
      viewBox="0 0 16 18"
      width="5"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <pattern
        height="1"
        id={`pattern${uniqueId}`}
        patternContentUnits="objectBoundingBox"
        width="2"
      >
        <use transform="scale(0.0111111 0.00980392)" xlinkHref="#image0_1384_4096" />
      </pattern>
    </Icon>
  );
};
