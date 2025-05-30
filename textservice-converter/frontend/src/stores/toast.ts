import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ToastMessage {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<ToastMessage[]>([])

  const showToast = (message: string, type: ToastMessage['type'] = 'info', duration = 4000) => {
    const id = Date.now().toString()
    const toast: ToastMessage = {
      id,
      message,
      type,
      duration
    }
    
    toasts.value.push(toast)

    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
    
    return id
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clearAllToasts = () => {
    toasts.value = []
  }

  // Convenience methods
  const showSuccess = (message: string, duration?: number) => showToast(message, 'success', duration)
  const showError = (message: string, duration?: number) => showToast(message, 'error', duration)
  const showWarning = (message: string, duration?: number) => showToast(message, 'warning', duration)
  const showInfo = (message: string, duration?: number) => showToast(message, 'info', duration)

  return {
    toasts,
    showToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
})