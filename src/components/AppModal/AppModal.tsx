import { useState } from 'react'

import {
	Modal,
	ModalBody,
	Button,
	ButtonGroup,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Input,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

import { RoundIcon } from '@/components/IconBox/RoundIcon';

import { useAppContext } from '@/contexts/AppContext'

// TODO: enhance css after merging sushan's sign in modal branch
export const AppModal = () => {

	const {
		appModal, setAppModal
	} = useAppContext()

	const [values, setValues] = useState({})

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

				{appModal.inputs?.length > 0 && <>
				
				{
					appModal.inputs.map(({ placeholder, valueKey }) => 
					<Input type="text" placeholder={placeholder} onChange={(e) => setValues({
						...values,
						...{ [valueKey]: e.target.value }
					})} />)
				}

				</>}

			</ModalBody>

			{appModal.options?.length > 0 && <ModalFooter>

			<ButtonGroup>
				{
					appModal.options.map(({
						label,
						func
					}, i) => <Button key={i} onClick={() => {
						func(values)
						setAppModal({ isOpen: false })
					}}>{label}</Button>)
				}
			</ButtonGroup>
			</ModalFooter>}

			</ModalContent>
			
		</Modal>
		);
}
