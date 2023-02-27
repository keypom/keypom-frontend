export const setMissingDropModal = (setAppModal, buttonProps = {}) => {
  setAppModal({
    isOpen: true,
    header: 'This drop has no more keys',
    message: `You will be reverted back to all drops`,
    options: [
      {
        label: 'Ok',
        func: () => null,
        buttonProps,
      },
    ],
  });
};
