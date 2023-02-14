import {
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Spinner,
	type UseDisclosureProps,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

import { RoundIcon } from '@/components/IconBox/RoundIcon';

import { useAppContext } from '@/contexts/AppContext'

// TODO: enhance css after merging sushan's sign in modal branch
export const AppModal = () => {

	const {
		appModal, setAppModal
	} = useAppContext()

	return (
		<Modal isOpen={appModal.isOpen} onClose={() => setAppModal({
			isOpen: false
		})}>
			<ModalOverlay />
			<ModalContent p={{ base: '8', md: '16' }} textAlign="center">
			<ModalHeader
				alignItems="center"
				display="flex"
				flexDir="column"
				fontSize={{ base: 'xl', md: '2xl' }}
				pb="0"
			>
				{appModal.header && <h4>{appModal.header}</h4>}
			</ModalHeader>
			<ModalBody>
				{appModal.message && <p>{appModal.message}</p>}
			</ModalBody>
			</ModalContent>
		</Modal>
		);
}
