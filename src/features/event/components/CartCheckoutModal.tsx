export const setCartCheckoutModal = (setAppModal, confirm, cancel) => {
  setAppModal({
    isOpen: true,
    header: 'Cart Checkout',
    message: 'Please click to checkout.',
    options: [
      {
        label: 'Cancel',
        func: () => {
          if (cancel) cancel();
        },
        buttonProps: {
          variant: 'outline',
        },
      },
      {
        label: 'Checkout',
        func: async () => {
          if (confirm) await confirm();
        },
      },
    ],
  });
};
