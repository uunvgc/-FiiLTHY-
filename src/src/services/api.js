import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const createCheckout = async (tier) => {
  const response = await api.post('/checkout', { tier })
  return response.data
}

export const generateLeads = async (subscriberId, tier) => {
  const response = await api.post('/api/leads/generate', {
    subscriber_id: subscriberId,
    tier
  })
  return response.data
}

export const downloadLeads = (subscriberId) => {
  window.open(`${API_URL}/api/leads/download/${subscriberId}`, '_blank')
}

export const getStats = async () => {
  const response = await api.get('/api/stats')
  return response.data
}

export const getHealth = async () => {
  const response = await api.get('/health')
  return response.data
}

export default api
