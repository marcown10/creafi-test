import React from 'react'
  import { motion, AnimatePresence } from 'framer-motion'
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
  } from '@/components/ui/dialog'
  import { Button } from '@/components/ui/button'
  import { Separator } from '@/components/ui/separator'
  import { AspectRatio } from '@/components/ui/aspect-ratio'
  import { ShoppingCart, Check } from 'lucide-react'
  import useCartStore from '@/store/cartStore'
  import { useToast } from '@/hooks/use-toast'

  const ProductDetail = ({ product, isOpen, onClose }) => {
    const addItem = useCartStore(state => state.addItem)
    const { toast } = useToast()

    if (!product) return null

    const handleAddToCart = () => {
      addItem(product)
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })
    }

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{product.name}</DialogTitle>
            <DialogDescription>{product.brand}</DialogDescription>
          </DialogHeader>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <AspectRatio ratio={1}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full rounded-lg"
                />
              </AspectRatio>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-2">Specifications</h3>
                <dl className="space-y-2">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <dt className="text-muted-foreground capitalize">{key}:</dt>
                      <dd className="font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold">${product.price}</p>
                <Button size="lg" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  export default ProductDetail
