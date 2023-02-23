export const setConfirmationModalHelper = (
  setAppModal,
  confirm,
  cancel,
  type = 'key',
  buttonProps = {},
) => {
  setAppModal({
    isOpen: true,
    header: 'Are you sure?',
    message: `You are going to delete the ${type === 'key' ? 'key' : 'drop'}.`,
    options: [
      {
        label: 'Delete',
        func: async () => {
          if (confirm) await confirm();
        },
        buttonProps,
      },
      {
        label: 'Cancel',
        func: () => {
          if (cancel) cancel();
        },
        buttonProps,
      },
    ],
  });
};
