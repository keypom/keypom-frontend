import { Button, Flex, Heading, Input } from '@chakra-ui/react';
import { useCallback, useState, useEffect } from 'react';
import { Controller, useFormContext, FormProvider, useForm } from 'react-hook-form';

import { IconBox } from '@/components/IconBox';
import { LinkIcon, TicketIcon } from '@/components/Icons';
import { FormControl } from '@/components/FormControl';


export const StripePurchaseTicketForm = ({ handleSubmitClick, setEventName, setStripeId, setTicketTier, setCustomerEmail, setCustomerName}) => {
    const methods = useForm();

    return (
            <FormProvider {...methods}>
                <IconBox
                    icon={<TicketIcon height={{ base: '6', md: '8' }} width={{ base: '6', md: '8' }} />}
                    maxW={{ base: '21.5rem', md: '36rem' }}
                    mx="auto"
                >
                    <Heading as="h1" textAlign="center" mb="4">Purchase Ticket Test</Heading>
                    <form onSubmit={methods.handleSubmit(handleSubmitClick)}>
                        <Controller
                            control={methods.control}
                            name="eventName"
                            render={({ field: { value, onChange } }) => {
                                return (
                                    <FormControl label="Event Name">
                                        <Input
                                            placeholder="Moon's Birthday Party"
                                            type="text"
                                            value={value || ''}
                                            onChange={(e) => {
                                                setEventName(e.target.value);
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
                            name="stripeId"
                            render={({ field: { value, onChange } }) => {
                                return (
                                    <FormControl label="Stripe Account ID">
                                        <Input
                                            placeholder="acct_1J2j3k4l5m6n7o8p"
                                            type="text"
                                            value={value || ''}
                                            onChange={(e) => {
                                                setStripeId(e.target.value);
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
                            name="ticketTier"
                            render={({ field: { value, onChange } }) => {
                                return (
                                    <FormControl label="Ticket Tier (VIP OR GENERAL ADMISSION)">
                                        <Input
                                            placeholder="VIP"
                                            type="text"
                                            value={value || ''}
                                            onChange={(e) => {
                                                setTicketTier(e.target.value);
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
                            name="customerName"
                            render={({ field: { value, onChange } }) => {
                                return (
                                    <FormControl label="Attendee Name">
                                        <Input
                                            placeholder="Toto Wolf"
                                            type="text"
                                            value={value || ''}
                                            onChange={(e) => {
                                                setCustomerName(e.target.value);
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
                            name="customerEmail"
                            render={({ field: { value, onChange } }) => {
                                return (
                                    <FormControl label="Attendee Email">
                                        <Input
                                            placeholder="toto@mercedes.com"
                                            type="text"
                                            value={value || ''}
                                            onChange={(e) => {
                                                setCustomerEmail(e.target.value);
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
                                Purchase Ticket
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
