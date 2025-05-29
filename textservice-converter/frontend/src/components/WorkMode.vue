<template>
  <div class="max-width-100 max-height-100">

    <!-- Input Mode Toggle -->
    <v-container>
      <!-- URL Input Mode -->
      <v-row dense class="">
        <v-col cols="12">
          <v-text-field v-model="urlInput" label="URL to TextService endpoint" color="primary" variant="outlined"
            :loading="isLoading" :disabled="isLoading" class="negative-margin-bottom" />
          <div class="bg-purple text-center mt-3">
            <v-btn class="w-100 mt-0" @click="fetchFromUrl(urlInput)" color="primary" :loading="isLoading"
              :disabled="isLoading || !urlInput" :size="buttonSize">
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
            <v-btn :disabled="!hasInput" class="mr-2 text-on-primary" @click="convertToOutput('text')" color="primary"
              :size="buttonSize" :variant="outputFormat == 'text' ? undefined : 'tonal'">
              <v-icon left class="mr-1">mdi-pen</v-icon>
              <p v-if="!xs">Text</p>
            </v-btn>

            <!-- Convert to XML Button -->
            <v-btn :disabled="!hasInput" class="mr-2 text-on-primary" @click="convertToOutput('xml')" color="secondary"
              :size="buttonSize" :variant="outputFormat == 'xml' ? undefined : 'tonal'">
              <v-icon left class="mr-1">mdi-code-tags</v-icon>
              <p v-if="!xs">XML</p>
            </v-btn>

            <!-- Convert to JSON Button -->
            <v-btn :disabled="!hasInput" class="mr-6 text-on-primary" @click="convertToOutput('json')" color="secondary"
              :size="buttonSize" :variant="outputFormat == 'json' ? undefined : 'tonal'">
              <v-icon left class="mr-1">mdi-code-json</v-icon>
              <p v-if="!xs">JSON</p>
            </v-btn>

            <!-- Copy text Button -->
            <v-btn :disabled="!hasInput" class="mr-2 text-on-primary" @click="copyToClipboard" color="secondary"
              :size="buttonSize" variant="outlined">
              <v-icon left class="mr-1">mdi-content-copy</v-icon>
              <p v-if="!xs">Copy</p>
            </v-btn>
          </div>

          <!-- Right column -->
          <div class="">
            <!-- Clear Button -->
            <v-btn size="x-small" icon="mdi-close" :disabled="!hasInput" @click="clearAll" color="red" />
          </div>
        </div>

      </v-row>

      <!-- Text Input/Visualizer -->
      <v-row>
        <v-col>
          <label style="display: block;"
            :class="['text-caption', 'mb-0', outputFormat !== 'text' ? 'text-secondary' : 'text-white']">
            {{ outputFormat !== 'text' ? 'Converted data (switch to TEXT for manual input)' : 'Paste your TextService data here...' }}
          </label>
          <div :style="`max-height: 55vh; overflow-y: auto; border: 1px solid ${outputFormat === 'text' ? '#FFFFFF' : '#FFBC57'}; border-radius: 4px;`" class="pl-2 pt-2">
            <v-textarea
              v-model="editableText"
              color="primary"
              variant="plain"
              auto-grow
              hide-details
              placeholder="P|FirstName|LastName&#10;T|mobile|landline&#10;A|street|city|zip&#10;F|name|year"
              :class="[outputFormat !== 'text' ? 'text-secondary' : 'text-white']"
              :readonly="outputFormat !== 'text'"
              style="margin-top: -16px; font-family: 'Courier New', 'Monaco', 'Consolas', monospace; font-size: 12px;"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>

  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { storeToRefs } from 'pinia'
import { useConverterStore } from '../stores/converter'
import { computed, ref, watch } from 'vue'

const { xs, md } = useDisplay()

// Compute button size based on screen size
const buttonSize = computed(() => (xs.value ? 'small' : undefined))

const store = useConverterStore()

const {
  isLoading,
  outputFormat,
  urlInput,
  hasInput,
  currentOutput
} = storeToRefs(store)

const {
  fetchFromUrl,
  convertToOutput,
  clearAll,
  setInputText
} = store

// Create a separate reactive variable for the textarea
const editableText = ref('')

// Watch currentOutput and update editableText when it changes (from store)
watch(currentOutput, (newValue) => {
  editableText.value = newValue
}, { immediate: true })

// Watch editableText and update the store when user types (ONLY if int text mode)
watch(editableText, (newValue) => {
  if(outputFormat.value !== 'text') return; // Only update if in text mode
  setInputText(newValue)
})

// Copy the current text amount to the clipboard
const copyToClipboard = (): void => {
  navigator.clipboard.writeText(editableText.value).then(() => {
    console.log(`${outputFormat.value} copied to clipboard!`);
  }).catch(err => {
    console.error("Failed to copy text: ", err);
  });
  
  alert(`${outputFormat.value} copied to clipboard!`);
}

</script>

<style scoped>
.output-display,
.centered-pre {
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
  margin-bottom: -26px;
  /* Moves the row closer to the previous element */
}

.align-end {
  display: flex;
  justify-content: flex-start;
  /* Align content to the top */
  justify-items: center;
}
</style>