import React, { useState } from 'react'
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from '@/components/ui/dialog'
  import { Button } from '@/components/ui/button'
  import { ArrowLeft, CreditCard, Loader2 } from 'lucide-react'
  import { loadStripe } from '@stripe/stripe-js'
  import {
    Elements,
    CardElement,
    useStripe,
    useElements,
  } from '@stripe/react-stripe-js'
  import useCartStore from '@/store/cartStore'
  import { paymentService } from '@/services/api'
  import { useToast } from '@/hooks/use-toast'

  // Replace with your actual Stripe publishable key
  const stripePromise = loadStripe('pk_test_YOUR_STRIPE_PUBLISHABLE_KEY')

  const CheckoutFormContent = ({ onSuccess }) => {
    const stripe = useStripe()
    const elements = useElements()
    const { items, getTotalPrice, clearCart } = useCartStore()
    const [isProcessing, setIsProcessing] = useState(false)
    const { toast } = useToast()

    const handleSubmit = async (e) => {
      e.preventDefault()

      if (!stripe || !elements) return

      setIsProcessing(true)

      try {
        // Create payment intent
        const { client_secret } = await paymentService.createPaymentIntent(
          getTotalPrice(),
          items
        )

        // Confirm payment
        const result = await stripe.confirmCardPayment(client_secret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        })

        if (result.error) {
          toast({
            title: "Payment failed",
            description: result.error.message,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Payment successful!",
            description: "Your order has been placed.",
          })
          clearCart()
          onSuccess()
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred during payment. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsProcessing(false)
      }
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Card Information
            </label>
            <div className="border rounded-md p-3">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="bg-secondary/50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Order Summary</h4>
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm mb-1">
                <span>{item.name} x{item.quantity}</span>
                <span>${item.price * item.quantity}</span>
              </div>
            ))}
            <div className="border-t mt-2 pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>${getTotalPrice()}</span>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay ${getTotalPrice()}
            </>
          )}
        </Button>
      </form>
    )
  }

  const CheckoutForm = ({ isOpen, onClose, onBack }) => {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onBack}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              Checkout
            </DialogTitle>
          </DialogHeader>

          <Elements stripe={stripePromise}>
            <CheckoutFormContent onSuccess={onClose} />
          </Elements>
        </DialogContent>
      </Dialog>
    )
  }

  export default CheckoutForm
