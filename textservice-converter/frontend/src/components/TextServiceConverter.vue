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
  inputText,
  outputXml,
  outputJson,
  isLoading,
  error,
  inputMode,
  outputFormat,
  urlInput,
  hasInput,
  hasOutput,
  currentOutput
} = storeToRefs(store)

const {
  fetchFromUrl,
  convertToOutput,
  clearAll,
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

.output-display, .centered-pre {
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 500px;
  overflow-y: auto;
  text-align: left;
}

.v-btn-toggle {
  background-color: #08283F !important;
}

pre {
  border: 1px solid #FFBC57;
}

.v-card-title {
  justify-content: center;
}

.v-row {
  justify-content: center;
}
</style>