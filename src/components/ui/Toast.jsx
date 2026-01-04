import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="toast-container">
                {toasts.map(toast => (
                    <div key={toast.id} className={`toast toast-${toast.type} slide-in`}>
                        <div className="toast-icon">
                            {toast.type === 'success' && <CheckCircle size={20} />}
                            {toast.type === 'error' && <AlertCircle size={20} />}
                            {toast.type === 'info' && <Info size={20} />}
                        </div>
                        <span className="toast-message">{toast.message}</span>
                        <button onClick={() => removeToast(toast.id)} className="toast-close">
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
            <style>{`
                .toast-container {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .toast {
                    min-width: 300px;
                    padding: 16px;
                    border-radius: 8px;
                    background: white;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    animation: slideIn 0.3s ease-out;
                    border-left: 4px solid #3b82f6;
                }
                .toast-success { border-left-color: #22c55e; }
                .toast-error { border-left-color: #ef4444; }
                .toast-info { border-left-color: #3b82f6; }
                
                .toast-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .toast-success .toast-icon { color: #22c55e; }
                .toast-error .toast-icon { color: #ef4444; }
                .toast-info .toast-icon { color: #3b82f6; }

                .toast-message {
                    flex: 1;
                    font-size: 0.9rem;
                    color: #1f2937;
                    font-weight: 500;
                }
                .toast-close {
                    background: none;
                    border: none;
                    color: #9ca3af;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    display: flex;
                }
                .toast-close:hover {
                    background: #f3f4f6;
                    color: #4b5563;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </ToastContext.Provider>
    );
};
