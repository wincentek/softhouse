<template>
  <div>
    
    <!-- Input Mode Toggle -->
    <v-container>
      <v-row class="">
        <div>
          <v-radio-group
            v-model="inputMode"
            inline
            class="text-caption">
            <v-radio label="Get from URL" value="url"></v-radio>
            <v-radio label="Paste Text" value="text"></v-radio>
          </v-radio-group>
        </div>
      </v-row>

      <!-- URL Input Mode -->
      <v-row dense v-if="inputMode === 'url'" class="" >
        <v-col cols="12">
          <v-text-field
            v-model="urlInput"
            label="URL to TextService endpoint"
            color="primary"
            variant="outlined"
            :loading="isLoading"
            :disabled="isLoading"
            class="negative-margin-bottom"
          />
          <div class="bg-purple text-center mt-3">
              <v-btn    
                class="w-100 mt-0"
                @click="fetchFromUrl(urlInput)"
                color="primary"
                :loading="isLoading"
                :disabled="isLoading || !urlInput"
                :size="buttonSize">
                <v-icon left>mdi-download</v-icon>
                Fetch
              </v-btn>
          </div>
        </v-col>
      </v-row>

      <v-row class="">
        <!-- Left Column -->
        <div class="pl-3 pr-3 w-100 align-end justify-space-between">
          <div class="align-end justify-space-between">
            <!-- Text Button -->
            <v-btn :disabled="!hasInput" class="mr-2 text-on-primary" @click="convertToOutput('text')" color="secondary" :size="buttonSize">
              <v-icon left class="mr-1">mdi-code-tags</v-icon>
              Text
            </v-btn>

            <!-- Convert to XML Button -->
            <v-btn :disabled="!hasInput" class="mr-2 text-on-primary" @click="convertToOutput('xml')" color="secondary" :size="buttonSize">
              <v-icon left class="mr-1">mdi-code-tags</v-icon>
              XML
            </v-btn>

            <!-- Convert to JSON Button -->
            <v-btn :disabled="!hasInput" class="text-on-primary" @click="convertToOutput('json')" color="secondary" :size="buttonSize">
              <v-icon left class="mr-1">mdi-code-json</v-icon>
              JSON
            </v-btn>
          </div>

          <!-- Clear Button -->
          <div class="">
            <v-btn :disabled="!hasInput" class="text-on-primary" @click="clearAll" color="secondary" variant="outlined" :size="buttonSize">
              <v-icon left class="mr-0">mdi-close</v-icon>
              Clear
            </v-btn>
          </div>
        </div>

      </v-row>

    </v-container>
    
    <!-- Text Input Mode -->
    <v-row v-if="inputMode === 'text'" class="mb-4 w-100">
      <v-col cols="12">
        <v-textarea
          v-model="inputText"
          label="Paste your TextService data here..."
          color="primary"
          variant="outlined"
          rows="8"
          auto-grow
          placeholder="P|FirstName|LastName&#10;T|mobile|landline&#10;A|street|city|zip&#10;F|name|year"
        />
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

    <!-- Output Display -->
    <v-row v-if="hasOutput" justify="center">
      <v-col cols="12">
        <v-card color="surface" elevation="2">
          <v-card-title class="text-primary text-center">
            <v-icon left>{{ outputFormat === 'xml' ? 'mdi-code-tags' : 'mdi-code-json' }}</v-icon>
            Generated {{ outputFormat.toUpperCase() }} Output
          </v-card-title>
          <v-card-text>
            <pre class="text-secondary text-body-2 pa-4 bg-background rounded output-display">{{ currentOutput }}</pre>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { storeToRefs } from 'pinia'
import { useConverterStore } from '../stores/converter'
import { computed } from 'vue'

const { xs } = useDisplay()

// Compute button size based on screen size
const buttonSize = computed(() => (xs.value ? 'small' : undefined))

const store = useConverterStore()

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'api/v1/textservice'

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

.output-display, .centered-pre {
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 500px;
  overflow-y: auto;
  text-align: left;
}

pre {
  border: 1px solid #FFBC57;
}

.negative-margin-bottom {
  margin-bottom: -26px; /* Moves the row closer to the previous element */
}

.align-end {
  display: flex;
  justify-content: flex-start; /* Align content to the top */
  justify-items: center;
}

</style>