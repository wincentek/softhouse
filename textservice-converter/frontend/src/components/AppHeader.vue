<template>
  <v-app-bar 
    color="background" 
    elevation="4" 
    :height="headerHeight"
    class="app-header" 
  >
    <v-container :class="containerClass">
      <div class="text-center">
        <h1 class="responsive-title text-md-h4 font-weight-bold text-primary mb-1">
          Text to XML Converter
        </h1>
        <p class="responsive-subtitle text-md-h8 text-medium-emphasis ma-0">
          Convert between pipe delimited plain text, XML and JSON formats
        </p>
      </div>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'

const { xs } = useDisplay()

const headerHeight = computed(() => xs.value ? 100 : 120)
const containerClass = computed(() => xs.value ? 'pa-2' : 'pa-4')
</script>

<style scoped>
.app-header {
  position: sticky !important;
  top: 0;
  z-index: 1000;
}

/* Responsive styles for the smallest breakpoint */
@media (max-width: 600px) {
  .responsive-title {
    font-size: 1.5rem; /* Adjust title size for small screens */
  }

  .responsive-subtitle {
    font-size: 0.875rem; /* Adjust subtitle size for small screens */
  }

  .app-header {
    padding: 8px; /* Reduce padding for small screens */
  }
}
</style>