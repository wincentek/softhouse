<template>
  <div class="converter-container">
    
    <!-- Error Display -->
    <v-row v-if="error" class="mb-4" justify="center">
      <v-col cols="12">
        <v-alert
          type="error"
          :text="error"
          closable
          @click:close="error = ''"
        />
      </v-col>
    </v-row>
   
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useConverterStore } from '../stores/converter'

const store = useConverterStore()

const {
  error,
  inputMode,
  outputFormat
} = storeToRefs(store)

const {
  setInputMode
} = store
</script>

<style scoped>
.converter-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: left;
}

</style>