import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { TextServiceParser } from '../utils/parser'
import { XmlGenerator } from '../utils/xmlGenerator'
import { ApiClient } from '../utils/api'
import type { ParsedData } from '../types'

export const useConverterStore = defineStore('converter', () => {
  // State
  const inputText = ref('')
  const outputXml = ref('')
  const isLoading = ref(false)
  const error = ref('')
  const inputMode = ref<'url' | 'text'>('url')
  const urlInput = ref(import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/textservice` : 'http://localhost:3001/api/textservice')

  // Computed
  const hasInput = computed(() => inputText.value.trim().length > 0)
  const hasOutput = computed(() => outputXml.value.trim().length > 0)

  // Actions
  async function fetchFromUrl(url: string) {
    isLoading.value = true
    error.value = ''
    
    try {
      const data = await ApiClient.fetchFromUrl(url)
      inputText.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch data'
      inputText.value = ''
    } finally {
      isLoading.value = false
    }
  }

  async function fetchFromDefaultUrl() {
    await fetchFromUrl(urlInput.value)
  }

  function convertToXml() {
    if (!hasInput.value) {
      error.value = 'No input text to convert'
      return
    }

    try {
      error.value = ''
      const parsedData: ParsedData = TextServiceParser.parseTextService(inputText.value)
      outputXml.value = XmlGenerator.generateXml(parsedData)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to convert text'
      outputXml.value = ''
    }
  }

  function clearAll() {
    inputText.value = ''
    outputXml.value = ''
    error.value = ''
  }

  function setInputText(text: string) {
    inputText.value = text
    error.value = ''
  }

  function setInputMode(mode: 'url' | 'text') {
    inputMode.value = mode
    error.value = ''
  }

  return {
    // State
    inputText,
    outputXml,
    isLoading,
    error,
    inputMode,
    urlInput,
    
    // Computed
    hasInput,
    hasOutput,
    
    // Actions
    fetchFromUrl,
    fetchFromDefaultUrl,
    convertToXml,
    clearAll,
    setInputText,
    setInputMode
  }
})