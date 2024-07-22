export const setConfirmationModalHelper = (setAppModal, confirm, type = 'key') => {
  setAppModal({
    isOpen: true,
    header: 'Are you sure?',
    message: `You are going to delete the ${type}.`,
    closeButtonVisible: true,
    options: [
      {
        label: 'Delete',
        func: async () => {
          if (confirm) await confirm();
        },
        buttonProps: { width: 'full' },
      },
    ],
  });
};
