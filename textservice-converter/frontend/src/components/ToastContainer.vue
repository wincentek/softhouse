<template>
  <div class="toast-container">
    <v-snackbar
      v-for="toast in toasts"
      :key="toast.id"
      v-model="toast.visible"
      :color="getToastColor(toast.type)"
      :timeout="toast.duration"
      location="top right"
      multi-line
      @click:outside="() => removeToast(toast.id)"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2" :color="getIconColor(toast.type)">
          {{ getToastIcon(toast.type) }}
        </v-icon>
        <span>{{ toast.message }}</span>
        <v-spacer />
        <v-btn
          icon="mdi-close"
          size="small"
          variant="text"
          @click="removeToast(toast.id)"
        />
      </div>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useToastStore, type ToastMessage } from '../stores/toast'

const toastStore = useToastStore()
const { toasts: storeToasts } = storeToRefs(toastStore)
const { removeToast } = toastStore

// Create local reactive toasts with visibility state
const toasts = ref<(ToastMessage & { visible: boolean })[]>([])

// Watch store toasts and update local toasts
watch(storeToasts, (newToasts) => {
  // Add new toasts
  newToasts.forEach(storeToast => {
    const existingToast = toasts.value.find(t => t.id === storeToast.id)
    if (!existingToast) {
      toasts.value.push({ ...storeToast, visible: true })
    }
  })

  // Remove toasts that are no longer in store
  toasts.value = toasts.value.filter(localToast => 
    newToasts.some(storeToast => storeToast.id === localToast.id)
  )
}, { deep: true, immediate: true })

const getToastColor = (type: ToastMessage['type']) => {
  switch (type) {
    case 'success':
      return 'success'
    case 'error':
      return 'error'
    case 'warning':
      return 'warning'
    case 'info':
    default:
      return 'info'
  }
}

const getToastIcon = (type: ToastMessage['type']) => {
  switch (type) {
    case 'success':
      return 'mdi-check-circle'
    case 'error':
      return 'mdi-alert-circle'
    case 'warning':
      return 'mdi-alert'
    case 'info':
    default:
      return 'mdi-information'
  }
}

const getIconColor = (type: ToastMessage['type']) => {
  switch (type) {
    case 'success':
      return 'white'
    case 'error':
      return 'white'
    case 'warning':
      return 'white'
    case 'info':
    default:
      return 'white'
  }
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

.toast-container :deep(.v-snackbar) {
  pointer-events: auto;
  position: relative !important;
  margin-bottom: 8px;
}
</style>