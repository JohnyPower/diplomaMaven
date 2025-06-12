// src/components/Drawer.tsx
import React from 'react';

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, children }) => {
    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Overlay */}
                    <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>

                    {/* Drawer */}
                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                            <button
                                onClick={onClose}
                                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:bg-gray-600"
                            >
                                <span className="text-white">×</span>
                            </button>
                        </div>
                        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                            <div className="px-4 sm:px-6">
                                <h2 className="text-lg font-medium text-gray-900">{title}</h2>
                            </div>
                            <div className="mt-6 relative flex-1 px-4 sm:px-6">
                                {children}
                            </div>
                        </div>
                    </div>

                    {/* Placeholder for the drawer's width */}
                    <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
                </div>
            )}
        </>
    );
};

export default Drawer;
