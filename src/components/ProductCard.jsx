import React from 'react'
  import { motion } from 'framer-motion'
  import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
  import { Button } from '@/components/ui/button'
  import { AspectRatio } from '@/components/ui/aspect-ratio'
  import { ShoppingCart, Info } from 'lucide-react'
  import useCartStore from '@/store/cartStore'
  import { useToast } from '@/hooks/use-toast'

  const ProductCard = ({ product, index, onProductClick }) => {
    const addItem = useCartStore(state => state.addItem)
    const { toast } = useToast()

    const handleAddToCart = (e) => {
      e.stopPropagation()
      addItem(product)
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -10 }}
        className="cursor-pointer"
        onClick={() => onProductClick(product)}
      >
        <Card className="overflow-hidden h-full">
          <CardHeader className="p-0">
            <AspectRatio ratio={1}>
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            </AspectRatio>
          </CardHeader>
          <CardContent className="p-6">
            <CardTitle className="mb-2">{product.name}</CardTitle>
            <p className="text-sm text-muted-foreground mb-4">{product.brand}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {product.features.slice(0, 2).map((feature, idx) => (
                <span key={idx} className="text-xs bg-secondary px-2 py-1 rounded">
                  {feature}
                </span>
              ))}
            </div>
            <p className="text-2xl font-bold">${product.price}</p>
          </CardContent>
          <CardFooter className="p-6 pt-0 gap-2">
            <Button 
              className="flex-1" 
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                onProductClick(product)
              }}
            >
              <Info className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    )
  }

  export default ProductCard
