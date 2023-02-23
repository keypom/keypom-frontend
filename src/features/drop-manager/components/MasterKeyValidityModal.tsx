export const setMasterKeyValidityModal = (setAppModal, buttonProps = {}) => {
  setAppModal({
    isOpen: true,
    header: 'The current master key is invalid',
    message: 'Please re-enter the correct one.',
    options: [
      {
        label: 'Close',
        func: () => null,
        buttonProps,
      },
    ],
  });
};
