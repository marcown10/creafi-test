import axios from 'axios'

  const API_BASE_URL = 'http://localhost:8000/api'

  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  export const paymentService = {
    createPaymentIntent: async (amount, items) => {
      try {
        const response = await api.post('/create-payment-intent', {
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'usd',
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price
          }))
        })
        return response.data
      } catch (error) {
        console.error('Error creating payment intent:', error)
        throw error
      }
    },

    confirmPayment: async (paymentIntentId) => {
      try {
        const response = await api.post('/confirm-payment', {
          payment_intent_id: paymentIntentId
        })
        return response.data
      } catch (error) {
        console.error('Error confirming payment:', error)
        throw error
      }
    }
  }

  export default api
