'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { showConnect, AuthOptions } from '@stacks/connect';
import { userSession, appConfig } from './stacks-config';

/**
 * StacksContextType
 * Defines the shape of the Stacks authentication context
 */
interface StacksContextType {
    /** Whether the user is signed in */
    isSignedIn: boolean;
    /** Current user's Stacks address */
    userAddress: string | null;
    /** Function to trigger wallet connection */
    connectWallet: () => void;
    /** Function to sign out the user */
    disconnectWallet: () => void;
}

const StacksContext = createContext<StacksContextType | undefined>(undefined);

/**
 * StacksProvider component
 * Provides Stacks authentication state to the application
 */
export function StacksProvider({ children }: { children: React.ReactNode }) {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [userAddress, setUserAddress] = useState<string | null>(null);

    useEffect(() => {
        if (userSession.isUserSignedIn()) {
            setIsSignedIn(true);
            setUserAddress(userSession.loadUserData().profile.stxAddress.mainnet);
        } else if (userSession.isSignInPending()) {
            userSession.handlePendingSignIn().then((userData) => {
                setIsSignedIn(true);
                setUserAddress(userData.profile.stxAddress.mainnet);
            });
        }
    }, []);

    const connectWallet = () => {
        const authOptions: AuthOptions = {
            appDetails: {
                name: 'Stacks DAO',
                icon: '/next.svg', // Replace with actual icon
            },
            userSession: userSession as any,
            onFinish: () => {
                setIsSignedIn(true);
                setUserAddress(userSession.loadUserData().profile.stxAddress.mainnet);
            },
            onCancel: () => {
                console.log('Connect cancelled');
            },
        };
        showConnect(authOptions);
    };

    const disconnectWallet = () => {
        userSession.signUserOut();
        setIsSignedIn(false);
        setUserAddress(null);
    };

    return (
        <StacksContext.Provider value={{ isSignedIn, userAddress, connectWallet, disconnectWallet }}>
            {children}
        </StacksContext.Provider>
    );
}

/**
 * useStacks
 * Functional UI component / utility
 */
export function useStacks() {
    const context = useContext(StacksContext);
    if (context === undefined) {
        throw new Error('useStacks must be used within a StacksProvider');
    }
    return context;
}
