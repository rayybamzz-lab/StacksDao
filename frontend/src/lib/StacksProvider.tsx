'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { showConnect, AuthOptions } from '@stacks/connect';
import { userSession, appConfig } from './stacks-config';

interface StacksContextType {
    isSignedIn: boolean;
    userAddress: string | null;
    connectWallet: () => void;
    disconnectWallet: () => void;
}

const StacksContext = createContext<StacksContextType | undefined>(undefined);

/**
 * StacksProvider component that manages the authentication state and
 * user session for the application.
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
 * Hook to access the Stacks authentication context.
 */
export function useStacks() {
    const context = useContext(StacksContext);
    if (context === undefined) {
        throw new Error('useStacks must be used within a StacksProvider');
    }
    return context;
}
