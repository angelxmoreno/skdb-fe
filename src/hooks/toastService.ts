// toastService.ts
import { toast, ToastOptions } from 'react-toastify';

export const showSuccess = (message: string, options?: ToastOptions) => {
    toast.success(message, options);
};

export const showError = (message: string, options?: ToastOptions) => {
    toast.error(message, options);
};

export const showInfo = (message: string, options?: ToastOptions) => {
    toast.info(message, options);
};

export const showWarning = (message: string, options?: ToastOptions) => {
    toast.warn(message, options);
};
