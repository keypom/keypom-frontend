import {
  Button,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
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
        border: '3px solid',
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

interface RoundedTabsProps {
  tablist: TabListItem[];
}

export const RoundedTabs = ({ tablist }: RoundedTabsProps) => {
  return (
    <Tabs variant="unstyled">
      <TabList
        bg="border.round"
        border="2px solid"
        borderColor="blue.500"
        borderRadius="5rem"
        maxW="max-content"
      >
        {tablist.map((tabItem) => (
          <RoundedTab key={tabItem.name}>{tabItem.label}</RoundedTab>
        ))}
      </TabList>
      <TabPanels>
        <TabPanel>1</TabPanel>
        <TabPanel>2</TabPanel>
      </TabPanels>
    </Tabs>
  );
};
