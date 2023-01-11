import {
  Button,
  TabList,
  Tabs,
  TabsProps,
  Text,
  useMultiStyleConfig,
  useTab,
} from '@chakra-ui/react';
import React, { PropsWithChildren } from 'react';

const RoundedTab = React.forwardRef((props: PropsWithChildren, ref: React.Ref<HTMLElement>) => {
  // 1. Reuse the `useTab` hook
  const tabProps = useTab({ ...props, ref });
  // const isSelected = !!tabProps['aria-selected'];

  // 2. Hook into the Tabs `size`, `variant`, props
  const styles = useMultiStyleConfig('Tabs', tabProps);

  return (
    <Button
      __css={styles.tab}
      _selected={{
        bgColor: 'white',
        border: '2px solid',
        borderColor: 'blue.300',
        color: 'black',
      }}
      alignItems="center"
      bgColor="transparent"
      border="transparent"
      borderBottom="initial"
      borderColor="transparent"
      borderRadius="5rem"
      color="blue.700"
      cursor="pointer"
      display="flex"
      m="-2px"
      {...tabProps}
    >
      {tabProps.children}
    </Button>
  );
});

RoundedTab.displayName = 'RoundedTab';

export interface TabListItem {
  name: string;
  label: string;
  icon?: React.ReactNode;
}

interface RoundedTabsProps extends TabsProps {
  tablist: TabListItem[];
  children: React.ReactNode;
}

export const RoundedTabs = ({
  tablist,
  children,
  ...props
}: PropsWithChildren<RoundedTabsProps>) => {
  return (
    <Tabs variant="unstyled" {...props}>
      <TabList
        // bg="border.round"
        bg="linear-gradient(180deg, rgba(239,250,253,1) 100%, rgba(221,244,250,1) 100%);"
        border="2px solid"
        borderColor="blue.200"
        borderRadius="5rem"
        maxW="max-content"
      >
        {tablist.map((tabItem) => (
          <RoundedTab key={tabItem.name}>
            {tabItem.icon}
            <Text color="inherit" fontWeight="medium" ml="2">
              {tabItem.label}
            </Text>
          </RoundedTab>
        ))}
      </TabList>
      {children}
    </Tabs>
  );
};
