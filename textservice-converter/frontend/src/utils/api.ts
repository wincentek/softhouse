import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 10000,
})

export class ApiClient {
  
  static async fetchTextServiceData(): Promise<string> {
    try {
      const response = await api.get('/textservice', {
        headers: {
          'Accept': 'text/plain'
        }
      })
      return response.data
    } catch (error) {
      console.error('Failed to fetch TextService data:', error)
      throw new Error('Failed to fetch data from server')
    }
  }

  static async fetchFromUrl(url: string): Promise<string> {
    try {
      // For our local API endpoint
      if (url.includes('/api/v1/textservice')) {
        return await this.fetchTextServiceData()
      }
      
      // For external URLs, use our backend proxy to avoid CORS
      if (url.startsWith('http')) {
        const proxyUrl = `${import.meta.env.VITE_API_BASE_URL || '/api/v1'}/proxy?url=${encodeURIComponent(url)}`
        const response = await fetch(proxyUrl)
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        return await response.text()
      }
      
      // For relative URLs, try direct fetch
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      return await response.text()
      
    } catch (error) {
      console.error('Failed to fetch from URL:', error)
      throw new Error(`Failed to fetch data from ${url}`)
    }
  }
}