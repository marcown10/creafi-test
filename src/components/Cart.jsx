import React, { useState } from 'react'
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from '@/components/ui/dialog'
  import { Button } from '@/components/ui/button'
  import { Separator } from '@/components/ui/separator'
  import { Trash2, Plus, Minus } from 'lucide-react'
  import useCartStore from '@/store/cartStore'
  import CheckoutForm from './CheckoutForm'

  const Cart = ({ isOpen, onClose }) => {
    const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore()
    const [showCheckout, setShowCheckout] = useState(false)

    const handleQuantityChange = (productId, newQuantity) => {
      if (newQuantity === 0) {
        removeItem(productId)
      } else {
        updateQuantity(productId, newQuantity)
      }
    }

    if (showCheckout) {
      return (
        <CheckoutForm
          isOpen={isOpen}
          onClose={() => {
            setShowCheckout(false)
            onClose()
          }}
          onBack={() => setShowCheckout(false)}
        />
      )
    }

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Shopping Cart</DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-4 max-h-[400px] overflow-y-auto">
            {items.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Your cart is empty
              </p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">${item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold">${getTotalPrice()}</span>
              </div>
            </>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Continue Shopping
            </Button>
            {items.length > 0 && (
              <Button onClick={() => setShowCheckout(true)}>
                Proceed to Checkout
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  export default Cart
