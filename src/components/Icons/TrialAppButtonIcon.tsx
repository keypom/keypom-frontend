import { Icon, type IconProps } from '@chakra-ui/react';

interface TrialAppButtonIconProps extends IconProps {
  media: string;
}

export const TrialAppButtonIcon = ({ media, ...props }: TrialAppButtonIconProps) => {
  console.log('props: ', props);
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
      <rect fill={`url(#pattern${uniqueId})`} height="17.4438" width="15.3916" y="0.169922" />
      <defs>
        <pattern
          height="1"
          id={`pattern${uniqueId}`}
          patternContentUnits="objectBoundingBox"
          width="1"
        >
          <use transform="scale(0.0111111 0.00980392)" xlinkHref="#image0_1384_4096" />
        </pattern>
        <image height="102" id="image0_1384_4096" width="500" xlinkHref={media} />
      </defs>
    </Icon>
  );
};
