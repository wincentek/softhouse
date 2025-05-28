<template>
  <div class="converter-container">

    <!-- Input Mode Toggle -->
    <v-row class="mb-4" justify="center">
      <v-col cols="12" class="text-center">
        <p class="text-primary">Work mode</p>
        <v-btn-toggle
          v-model="inputMode"
          color="primary"
          mandatory
          class="mb-4"
        >
          <v-btn value="url" class="text-on-primary">
            <v-icon left>mdi-link</v-icon>
            URL BASED
          </v-btn>
          <v-btn value="text" class="text-on-primary">
            <v-icon left>mdi-text</v-icon>
            Paste Text
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <!-- URL Input Mode -->
    <v-row v-if="inputMode === 'url'" class="mb-4 w-100" justify="center">
      <v-col cols="12">
        <v-card color="surface" elevation="2">
          <v-card-title class="text-primary text-center">
            <v-icon left>mdi-link</v-icon>
            Fetch TextService Data
          </v-card-title>
          <v-card-text class="text-center">
            <v-text-field
              v-model="urlInput"
              label="URL to TextService endpoint"
              color="primary"
              variant="outlined"
              :loading="isLoading"
              :disabled="isLoading"
              class="mb-4"
            />
            <v-btn
              @click="fetchFromDefaultUrl"
              color="primary"
              :loading="isLoading"
              :disabled="isLoading"
              size="large"
            >
              <v-icon left>mdi-download</v-icon>
              Fetch Data
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Text Input Mode -->
    <v-row v-if="inputMode === 'text'" class="mb-4 w-100" justify="center">
      <v-col cols="12">
        <v-card color="surface" elevation="2">
          <v-card-title class="text-primary text-center">
            <v-icon left>mdi-text</v-icon>
            Paste TextService Data
          </v-card-title>
          <v-card-text>
            <v-textarea
              v-model="inputText"
              label="Paste your TextService data here..."
              color="primary"
              variant="outlined"
              rows="8"
              auto-grow
              placeholder="P|FirstName|LastName&#10;T|mobile|landline&#10;A|street|city|zip&#10;F|name|year"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Input Display (when fetched) -->
    <v-row v-if="hasInput && inputMode === 'url'" class="mb-4" justify="center">
      <v-col cols="12">
        <v-card color="surface" elevation="2">
          <v-card-title class="text-primary text-center">
            <v-icon left>mdi-file-document</v-icon>
            Fetched TextService Data
          </v-card-title>
          <v-card-text>
            <pre class="text-secondary text-body-2 pa-2 bg-background rounded centered-pre">{{ inputText }}</pre>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Convert Button -->
    <v-row class="mb-4" justify="center">
      <v-col cols="12" class="text-center">
        <v-btn
          @click="convertToXml"
          color="primary"
          size="x-large"
          :disabled="!hasInput"
          elevation="2"
          class="mx-2"
        >
          <v-icon left>mdi-arrow-right</v-icon>
          Convert to XML
        </v-btn>
        
        <v-btn
          v-if="hasInput || hasOutput"
          @click="clearAll"
          color="secondary"
          variant="outlined"
          size="large"
          class="mx-2"
        >
          <v-icon left>mdi-close</v-icon>
          Clear All
        </v-btn>
      </v-col>
    </v-row>

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

    <!-- XML Output -->
    <v-row v-if="hasOutput" justify="center">
      <v-col cols="12">
        <v-card color="surface" elevation="2">
          <v-card-title class="text-primary text-center">
            <v-icon left>mdi-code-tags</v-icon>
            Generated XML Output
          </v-card-title>
          <v-card-text>
            <pre class="text-secondary text-body-2 pa-4 bg-background rounded xml-output">{{ outputXml }}</pre>
          </v-card-text>
        </v-card>
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
  isLoading,
  error,
  inputMode,
  urlInput,
  hasInput,
  hasOutput
} = storeToRefs(store)

const {
  fetchFromDefaultUrl,
  convertToXml,
  clearAll,
  setInputMode
} = store
</script>

<style scoped>
.converter-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.xml-output, .centered-pre {
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