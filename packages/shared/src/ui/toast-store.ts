import { ToastItem, ToastType, ConfirmDialogOptions, PromptDialogOptions } from './toast-types.js';

type Listener = () => void;

let toasts: ToastItem[] = [];
let confirmOptions: ConfirmDialogOptions | null = null;
let promptOptions: PromptDialogOptions | null = null;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((fn) => fn());
}

export const toastStore = {
  subscribe(fn: Listener) {
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  },
  getToasts(): ToastItem[] {
    return toasts;
  },
  getConfirm(): ConfirmDialogOptions | null {
    return confirmOptions;
  },
  getPrompt(): PromptDialogOptions | null {
    return promptOptions;
  },
  add(message: string, type: ToastType = 'info', options?: { title?: string; duration?: number }): string {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const duration = options?.duration ?? 4000;
    const item: ToastItem = { id, message, type, title: options?.title, duration };
    toasts = [...toasts, item];
    notify();
    if (duration > 0) {
      setTimeout(() => { toastStore.dismiss(id); }, duration);
    }
    return id;
  },
  dismiss(id: string) {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  },
  clear() {
    toasts = [];
    notify();
  },
  showConfirm(opts: ConfirmDialogOptions) {
    confirmOptions = opts;
    notify();
  },
  closeConfirm() {
    confirmOptions = null;
    notify();
  },
  showPrompt(opts: PromptDialogOptions) {
    promptOptions = opts;
    notify();
  },
  closePrompt() {
    promptOptions = null;
    notify();
  },
};

export const toast = {
  success: (msg: string, title?: string) => toastStore.add(msg, 'success', { title }),
  error: (msg: string, title?: string) => toastStore.add(msg, 'error', { title, duration: 6000 }),
  info: (msg: string, title?: string) => toastStore.add(msg, 'info', { title }),
  warning: (msg: string, title?: string) => toastStore.add(msg, 'warning', { title, duration: 5000 }),
  dismiss: (id: string) => toastStore.dismiss(id),
};

export const dialog = {
  confirm: (opts: ConfirmDialogOptions) => toastStore.showConfirm(opts),
  prompt: (opts: PromptDialogOptions) => toastStore.showPrompt(opts),
};
