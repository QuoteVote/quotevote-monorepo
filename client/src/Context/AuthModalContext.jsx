import React, {createContext, useState, useContext} from 'react';
import PropTypes from 'prop-types';

const AuthModalContext = createContext();

export function AuthModalProvider({children}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openAuthModal = () => setIsModalOpen(true);
    const closeAuthModal = () => setIsModalOpen(false);

    const value = { isModalOpen, openAuthModal, closeAuthModal };

    return (
        <AuthModalContext.Provider value={value}>
            {children}
        </AuthModalContext.Provider>
    );
}

AuthModalProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuthModal = () => {
    const context = useContext(AuthModalContext);
    if (context === undefined) {
        throw new Error('useAuthModal must be used within an AuthModalProvider');
    }
    return context;
};