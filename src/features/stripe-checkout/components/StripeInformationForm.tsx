import { Button, Flex, Heading, Input } from '@chakra-ui/react';
import { useCallback, useState, useEffect } from 'react';
import { Controller, useFormContext, FormProvider, useForm } from 'react-hook-form';

import { IconBox } from '@/components/IconBox';
import { LinkIcon, TicketIcon } from '@/components/Icons';
import { FormControl } from '@/components/FormControl';


export const StripeUserInfoForm = ({ handleSubmitClick, setFirstName, setLastName, setEmail }) => {
    const methods = useForm();

    return (
            <FormProvider {...methods}>
                <IconBox
                    icon={<TicketIcon height={{ base: '6', md: '8' }} width={{ base: '6', md: '8' }} />}
                    maxW={{ base: '21.5rem', md: '36rem' }}
                    mx="auto"
                >
                    <Heading as="h1" textAlign="center" mb="4">Enable Stripe Payments</Heading>
                    <form onSubmit={methods.handleSubmit(handleSubmitClick)}>
                        <Controller
                            control={methods.control}
                            name="firstName"
                            render={({ field: { value, onChange } }) => {
                                return (
                                    <FormControl label="First Name">
                                        <Input
                                            placeholder="Illia"
                                            type="text"
                                            value={value || ''}
                                            onChange={(e) => {
                                                setFirstName(e.target.value);
                                                onChange(e.target.value);
                                            }}
                                            mt="2" // Add margin-top for vertical spacing
                                        />
                                    </FormControl>
                                );
                            }}
                        />

                        <Controller
                            control={methods.control}
                            name="lastName"
                            render={({ field: { value, onChange } }) => {
                                return (
                                    <FormControl label="Last Name">
                                        <Input
                                            placeholder="Polosukhin"
                                            type="text"
                                            value={value || ''}
                                            onChange={(e) => {
                                                setLastName(e.target.value);
                                                onChange(e.target.value);
                                            }}
                                            mt="2" // Add margin-top for vertical spacing
                                        />
                                    </FormControl>
                                );
                            }}
                        />

                        <Controller
                            control={methods.control}
                            name="email"
                            render={({ field: { value, onChange } }) => {
                                return (
                                    <FormControl label="Email">
                                    <Input
                                        placeholder="ilblackdragon@gmail.com"
                                        type="text"
                                        value={value || ''}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            onChange(e.target.value);
                                        }}
                                        mt="2" // Add margin-top for vertical spacing
                                    />
                                    </FormControl>
                                );
                            }}
                        />

                        <Flex justifyContent="center" alignItems="center" mb="2">
                            <Button disabled={!methods.formState.isDirty || !methods.formState.isValid} mt="4" type="submit">
                                Connect Stripe Account
                            </Button>
                        </Flex>
                        <Flex justifyContent="center" alignItems="center">
                            <p style={{ fontSize: '0.8rem', color: '#888888' }}>You will be redirected to a Stripe Portal to complete KYC</p>
                        </Flex>
                    </form>
                </IconBox>
            </FormProvider>
        );
};
