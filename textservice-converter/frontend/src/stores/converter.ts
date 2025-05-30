import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { TextServiceParser } from '../utils/parser'
import { XmlGenerator } from '../utils/xmlGenerator'
import { JsonGenerator } from '../utils/jsonGenerator'
import { ApiClient } from '../utils/api'
import type { ParsedData } from '../types'
import { useToastStore } from '../stores/toast'

export const useConverterStore = defineStore('converter', () => {
  // State
  const inputText = ref('')
  const outputText = ref('')
  const outputXml = ref('')
  const outputJson = ref('')
  const isLoading = ref(false)
  const outputFormat = ref<'xml' | 'json' | 'text'>('text')
  const urlInput = ref(import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/textservice` : 'api/v1/textservice')
  const toastStore = useToastStore()
  
  // Computed
  const hasInput = computed(() => inputText.value.trim().length > 0)
  const hasOutput = computed(() => {
    // Check for text output
    if (outputFormat.value === 'text') return outputText.value.trim().length > 0
    if (outputFormat.value === 'xml') return outputXml.value.trim().length > 0
    if (outputFormat.value === 'json') return outputJson.value.trim().length > 0

    return false
})
  const currentOutput = computed(() => {
    if (!hasOutput.value) return ''
    if (outputFormat.value === 'text') return outputText.value
    if (outputFormat.value === 'xml') return outputXml.value
    if (outputFormat.value === 'json') return outputJson.value 

    toastStore.showError(`Unknown output format: ${outputFormat.value}`);
    return ''
  })

  // Actions
  async function fetchFromUrl(url: string) {
    console.log(`Fetching data from URL: ${url}`)
    isLoading.value = true
    
    try {
      const data = await ApiClient.fetchFromUrl(url)
      setInputText(data)
      // Automatically genereate XML output when data is fetched 
      convertToOutput('xml')
    } catch (err) {
      clearAll()
      setOutputFormat('text')
      toastStore.showError(err instanceof Error ? err.message : `Failed to fetch data from URL ${url}`);
    } finally {
      isLoading.value = false
    }
  }

  function convertToOutput(format: 'xml' | 'json' | 'text') {
    setOutputFormat(format);

    if (!hasInput.value) {
      toastStore.showError('No input text to convert');
      return
    }

    try {
      const parsedData: ParsedData = TextServiceParser.parseTextService(inputText.value)
      if (outputFormat.value === 'text') {
        outputText.value = inputText.value.toString() // copy text, not a refernce.
        outputXml.value = '' // Clear other format
        outputJson.value = '' // Clear other format
      } else if (outputFormat.value === 'xml') {
        outputText.value = '' // Clear other format
        outputXml.value = XmlGenerator.generateXml(parsedData)
        outputJson.value = '' // Clear other format
      } else {
        outputText.value = '' // Clear other format
        outputXml.value = '' // Clear other format
        outputJson.value = JsonGenerator.generateJson(parsedData)
      }
    } catch (err) {
      toastStore.showError(err instanceof Error ? err.message : 'Failed to convert text')
      outputXml.value = ''
      outputJson.value = ''
    }
  }

  function clearAll() {
    setInputText('')
    outputText.value = ''
    outputXml.value = ''
    outputJson.value = ''
  }

  function setInputText(text: string) {
    inputText.value = text
  }

  function setOutputFormat(format: 'xml' | 'json' | 'text') {
    outputFormat.value = format
  }

  return {
    // State
    inputText,
    isLoading,
    outputFormat,
    urlInput,
    
    // Computed
    hasInput,
    hasOutput,
    currentOutput,
    
    // Actions
    fetchFromUrl,
    convertToOutput,
    clearAll,
    setInputText
  }
})