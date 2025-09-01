import React from 'react'
  import { ShoppingCart, Smartphone, Menu } from 'lucide-react'
  import { Button } from '@/components/ui/button'
  import useCartStore from '@/store/cartStore'
  import { motion } from 'framer-motion'

  const Navbar = ({ onCartClick }) => {
    const totalItems = useCartStore(state => state.getTotalItems())

    return (
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Smartphone className="h-6 w-6" />
            <h1 className="text-xl font-bold">TechStore</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="#home" className="hover:text-primary transition-colors">Home</a>
            <a href="#products" className="hover:text-primary transition-colors">Products</a>
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={onCartClick}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </motion.nav>
    )
  }

  export default Navbar
