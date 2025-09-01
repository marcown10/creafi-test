import React from 'react'
  import { motion } from 'framer-motion'
  import { useInView } from 'react-intersection-observer'
  import ProductCard from './ProductCard'
  import { products } from '@/data/products'

  const ProductGrid = ({ onProductClick }) => {
    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.1
    })

    return (
      <section id="products" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Featured Smartphones</h2>
            <p className="text-xl text-muted-foreground">
              Discover the latest and greatest in mobile technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onProductClick={onProductClick}
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  export default ProductGrid
