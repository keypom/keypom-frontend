import { Box, Input } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { IconBox } from '@/common/components/IconBox';
import { HereLogoIcon, LinkIcon, MyNearLogoIcon, NearLogoIcon } from '@/common/components/Icons';
import { FormControl } from '@/common/components/FormControl';
import { Checkboxes, ICheckbox } from '@/common/components/Checkboxes';
import { IWalletBalance, WalletBalanceInput } from '@/common/components/WalletBalanceInput';

const WALLET_OPTIONS: ICheckbox[] = [
  {
    name: 'NEAR Wallet',
    value: 'near_wallet',
    icon: <NearLogoIcon height="7" width="5" />,
  },
  {
    name: 'My NEAR Wallet',
    value: 'my_near_wallet',
    icon: <MyNearLogoIcon height="6" width="5" />,
  },
  {
    name: 'HERE Wallet',
    value: 'here_wallet',
    icon: <HereLogoIcon height="7" width="5" />,
  },
];

const WALLET_BALANCES = [
  {
    amount: 500,
    symbol: 'NEAR',
    icon: <NearLogoIcon height="4" width="4" />,
  },
  {
    amount: 1000,
    symbol: 'USDC',
    icon: <MyNearLogoIcon height="5" width="5" />,
  },
  {
    amount: 10,
    symbol: 'ETH',
    icon: <HereLogoIcon height="4" width="4" />,
  },
];

export const CreateTokenDropForm = () => {
  const [selectedWallet, setSelectedWallet] = useState<IWalletBalance>(WALLET_BALANCES[0]);
  const [amountPerLink, setAmountPerLink] = useState<number | undefined>();
  const [totalCost, setTotalCost] = useState(0);

  const [totalLinks, setTotalLinks] = useState(0);

  const [checkboxes, setCheckboxes] = useState({
    near_wallet: true,
    my_near_wallet: false,
    here_wallet: false,
  });

  useEffect(() => {
    if (totalLinks && amountPerLink) {
      setTotalCost(totalLinks * amountPerLink);
    }
  }, [totalLinks, amountPerLink]);

  const handleCheckboxChange = (value: string, isChecked: boolean) => {
    setCheckboxes({ ...checkboxes, [value]: isChecked });
  };

  const handleWalletChange = (walletSymbol: string) => {
    setSelectedWallet(WALLET_BALANCES.find((wallet) => wallet.symbol === walletSymbol));
  };

  return (
    <IconBox icon={<LinkIcon />} maxW={{ base: '21.5rem', md: '36rem' }}>
      <Box>
        <FormControl helperText="Will be shown on the claim page" label="Token Drop name">
          <Input placeholder="Star Invasion Beta Invites" type="text" />
        </FormControl>

        <FormControl label="Number of links">
          <Input
            placeholder="1 - 10,000"
            type="number"
            onChange={(e) => setTotalLinks(parseInt(e.target.value))}
          />
        </FormControl>

        <FormControl label="Amount per link">
          <WalletBalanceInput
            amountValue={amountPerLink}
            selectedWallet={selectedWallet}
            totalCost={totalCost}
            walletBalances={WALLET_BALANCES}
            onAmountChange={(val) => setAmountPerLink(parseFloat(val))}
            onOptionClick={handleWalletChange}
          />
        </FormControl>

        <FormControl helperText="Choose which wallet to set people up with." label="Wallets">
          <Checkboxes items={WALLET_OPTIONS} values={checkboxes} onChange={handleCheckboxChange} />
        </FormControl>

        <FormControl
          helperText="Where should the user be sent after signing up?"
          label="Redirect link (optional)"
        >
          <Input placeholder="mark@hotmail.com" type="number" />
        </FormControl>
      </Box>
    </IconBox>
  );
};
