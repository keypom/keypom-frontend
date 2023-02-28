import { set } from '@/utils/localStorage';

export const setMasterKeyValidityModal = (setAppModal, confirm, cancel) => {
  setAppModal({
    isOpen: true,
    header: 'Incorrect Master Key for Current Drop',
    message: 'Please re-enter the correct key for the current drop.',
    inputs: [
      {
        placeholder: 'Master Key',
        valueKey: 'masterKey',
      },
    ],
    options: [
      {
        label: 'Cancel',
        func: () => {
          // eslint-disable-next-line no-console
          console.log('user cancelled');
          if (cancel) cancel();
        },
        buttonProps: {
          variant: 'outline',
        },
      },
      {
        label: 'Set Master Key',
        func: ({ masterKey }) => {
          set('MASTER_KEY', masterKey);
          if (confirm) confirm();
        },
      },
    ],
  });
};
