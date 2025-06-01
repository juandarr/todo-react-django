import React from 'react';

interface ModalContextType {
	isModalOpen: boolean;
	setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ModalContext = React.createContext<ModalContextType | undefined>(
	undefined
);

export function useModal() {
	const context = React.useContext(ModalContext);
	if (context === undefined) {
		throw new Error('useModal must be used within a ModalProvider');
	}
	return context;
}
