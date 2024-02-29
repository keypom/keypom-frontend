// import { Button, Flex, Input } from '@chakra-ui/react';
// import { useCallback, useState, useEffect } from 'react';
// import { Controller, useFormContext } from 'react-hook-form';
// import { formatNearAmount, createDrop } from 'keypom-js';

// import { IconBox } from '@/components/IconBox';
// import { FormControl } from '@/components/FormControl';
// import { Checkboxes } from '@/components/Checkboxes';
// import { TokenInput } from '@/components/TokenInputMenu';
// import { LinkIcon } from '@/components/Icons';
// import { useDropFlowContext } from '@/features/create-drop/contexts';
// import { get } from '@/utils/localStorage';
// import { MASTER_KEY } from '@/constants/common';
// import { useAppContext, openMasterKeyModal } from '@/contexts/AppContext';
// import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
// import getConfig from '@/config/config';
// import { type IToken } from '@/types/common';

// import { WALLET_CHECKBOXES } from '@/features/create-drop/components/WalletComponent';

// const stripe = require('stripe')("sk_test_51OiK2DBuXHcYytHqo1SoogX5L607gYvi8sJ9Tm2uPL3FgT2FU4SZWnXoWBrNWlsecyR9rHTOnKw5Cn2uk34OnFAh001IOVNnom", {
//   apiVersion: '2022-08-01'
// });

// const { defaultWallet } = getConfig();

// export const StripeUserInfoForm = () => {
//   const { setAppModal } = useAppContext();
//   const { account, isLoggedIn } = useAuthWalletContext();
  
//   const handleSubmitClick = () => {
//     // Define the parameters to create a new Stripe account with
//     let accountParams = {
//       type: 'express',
//       country: undefined,
//       email: undefined,
//       business_type: 'individual', 
//       individual: {
//         first_name: undefined,
//         last_name: undefined,
//         email: undefined
//       },
//       }

//       const account = await stripe.accounts.create(accountParams);
//       const stripe_id = account.accountId;

//       const accountLink = await stripe.accountLinks.create({
//         account: accountId,
//         // current URL
//         refresh_url: '/pilots/stripe/authorize',
//         // redirect to dashboard
//         return_url: '/pilots/stripe/onboarded',
//         type: 'account_onboarding'
//       });


//     }
//   };

//   if(isLoggedIn){
//     // get stripe connection information
    
//   }else{
//     return <div>Log in to connect a Stripe Account</div>
//   }

//   const WALLET_TOKENS: IToken[] = account
//     ? [
//         {
//           amount: formatNearAmount(account.amount, 4),
//           symbol: 'NEAR',
//         },
//       ]
//     : [];

//   const { onNext } = useDropFlowContext();
//   const {
//     setValue,
//     handleSubmit,
//     control,
//     watch,
//     formState: { isDirty, isValid },
//   } = useFormContext();

//   const [totalCost, setTotalCost] = useState(0);

//   const [selectedToken, amountPerLink, totalLinks] = watch([
//     'selectedToken',
//     'amountPerLink',
//     'totalLinks',
//   ]);

//   const calcTotalCost = async () => {
//     console.log(totalLinks, amountPerLink, totalCost);
//     if (totalLinks && amountPerLink) {
//       const { requiredDeposit } = await createDrop({
//         wallet: await window.selector.wallet(),
//         depositPerUseNEAR: amountPerLink,
//         numKeys: totalLinks,
//         returnTransactions: true,
//       });
//       setTotalCost(parseFloat(formatNearAmount(requiredDeposit!, 4)));
//     }
//   };

//   useEffect(() => {
//     calcTotalCost();
//   }, [amountPerLink, totalLinks]);

//   const handleWalletChange = (walletSymbol: string) => {
//     const foundWallet = WALLET_TOKENS.find((wallet) => wallet.symbol === walletSymbol);
//     setValue('selectedToken', { symbol: foundWallet?.symbol, amount: foundWallet?.amount });
//   };

//   const handleCheckboxChange = useCallback(
//     (value) => {
//       setValue('selectedToWallets', value, { shouldValidate: true });
//     },
//     [setValue],
//   );

//   return (
//     <IconBox
//       icon={<LinkIcon h={{ base: '7', md: '9' }} />}
//       maxW={{ base: '21.5rem', md: '36rem' }}
//       mx="auto"
//     >
//       <form onSubmit={handleSubmit(handleSubmitClick)}>
//         <Controller
//           control={control}
//           name="dropName"
//           render={({ field, fieldState: { error } }) => {
//             return (
//               <FormControl
//                 errorText={error?.message}
//                 helperText="Will be shown on the claim page"
//                 label="Token Drop name"
//               >
//                 <Input
//                   isInvalid={Boolean(error?.message)}
//                   placeholder="NEARCon Token Giveaway"
//                   type="text"
//                   {...field}
//                 />
//               </FormControl>
//             );
//           }}
//         />

//         <Controller
//           control={control}
//           name="totalLinks"
//           render={({ field: { value, onChange, ...fieldProps }, fieldState: { error } }) => {
//             return (
//               <FormControl errorText={error?.message} label="Number of links">
//                 <Input
//                   isInvalid={Boolean(error?.message)}
//                   placeholder="1 - 50"
//                   type="number"
//                   value={value || ''}
//                   onChange={(e) => {
//                     onChange(parseInt(e.target.value));
//                   }}
//                   {...fieldProps}
//                 />
//               </FormControl>
//             );
//           }}
//         />

//         <Controller
//           control={control}
//           name="amountPerLink"
//           render={({ field: { value, onChange, name }, fieldState: { error } }) => (
//             <FormControl errorText={error?.message} label="Amount per link">
//               <TokenInput
//                 isInvalid={Boolean(error?.message)}
//                 maxLength={14}
//                 name={name}
//                 value={value}
//                 onChange={(e) => {
//                   if (e.target.value.length > e.target.maxLength)
//                     e.target.value = e.target.value.slice(0, e.target.maxLength);
//                   onChange(e.target.value);
//                 }}
//               >
//                 <TokenInput.TokenMenu
//                   selectedToken={selectedToken}
//                   tokens={WALLET_TOKENS}
//                   onChange={handleWalletChange}
//                 />
//                 <TokenInput.CostDisplay
//                   balanceAmount={selectedToken.amount}
//                   symbol={selectedToken.symbol}
//                   totalCost={totalCost}
//                 />
//               </TokenInput>
//             </FormControl>
//           )}
//         />

//         <Controller
//           control={control}
//           name="selectedToWallets"
//           render={({ fieldState: { error } }) => (
//             <FormControl
//               errorText={error?.message}
//               helperText="Choose which wallet to set people up with."
//               label="Wallets"
//             >
//               <Checkboxes
//                 defaultValues={[defaultWallet.name]}
//                 items={WALLET_CHECKBOXES}
//                 onChange={handleCheckboxChange}
//               />
//             </FormControl>
//           )}
//         />

//         {/* <Controller
//           control={control}
//           name="redirectLink"
//           render={({ field, fieldState: { error } }) => (
//             <FormControl
//               errorText={error?.message}
//               helperText="Where should the user be sent after signing up?"
//               label="Redirect link (optional)"
//             >
//               <Input
//                 isInvalid={Boolean(error?.message)}
//                 placeholder="Enter a link"
//                 type="text"
//                 {...field}
//               />
//             </FormControl>
//           )}
//         /> */}
//         <Flex justifyContent="flex-end">
//           <Button disabled={!isDirty || !isValid} mt="10" type="submit">
//             Continue to summary
//           </Button>
//         </Flex>
//       </form>
//     </IconBox>
//   );
// };
