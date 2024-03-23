import ConfirmDeletionModal from './ConfirmDeletionModal';

const useDeletion = ({ setAppModal }) => {
  const openConfirmationModal = (dropId, customMessage, onConfirmCallback) => {
    setAppModal({
      isOpen: true,
      canClose: false,
      size: 'xl',
      modalContent: (
        <ConfirmDeletionModal
          confirmMessage={customMessage}
          onCancel={() => setAppModal({ isOpen: false })}
          onConfirm={() => {
            setAppModal({ isOpen: false }); // Close confirmation modal
            onConfirmCallback(dropId); // Execute the deletion process
          }}
        />
      ),
    });
  };

  return { openConfirmationModal };
};

export default useDeletion;
