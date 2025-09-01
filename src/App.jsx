import React, { useState, useEffect } from 'react'
  import { motion, useScroll, useTransform } from 'framer-motion'
  import { ShoppingCart, Smartphone, Plus, Minus, Trash2, CreditCard, ChevronDown, Star, Shield, Truck } from 'lucide-react'
  import { Button } from '@/components/ui/button'
  import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
  import { createCheckoutSession, verifyPayment } from '@/api/stripe'

  // Dati prodotti esempio
  const products = [
    {
      id: 1,
      name: "iPhone pDdddddddddd Pro Mfffax",
      brand: "Apple",
      price: 1199,
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=60",
      features: ["A17 Pro chip", "Titanium design", "48MP camera"],
      description: "Il più potente iPhone mai creato con design in titanio rivoluzionario."
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra",
      brand: "Samsung",
      price: 1299,
      image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=60",
      features: ["S Pen inclusa", "200MP camera", "Galaxy AI"],
      description: "Produttività definitiva con S Pen integrata e Galaxy AI."
    },
    {
      id: 3,
      name: "Google Pixel 8 Pro",
      brand: "Google",
      price: 999,
      image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=60",
      features: ["Tensor G3", "Magic Eraser", "7 anni di aggiornamenti"],
      description: "Il Pixel più intelligente con Google AI al suo interno."
    },
    {
      id: 4,
      name: "OnePlus 12",
      brand: "OnePlus",
      price: 799,
      image: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&auto=format&fit=crop&q=60",
      features: ["Snapdragon 8 Gen 3", "100W charging", "Hasselblad camera"],
      description: "Performance flagship a un prezzo imbattibile."
    }
  ]

  function App() {
    const [cart, setCart] = useState([])
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const { scrollY } = useScroll()
    const heroY = useTransform(scrollY, [0, 500], [0, 150])
    const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])
    const parallaxY = useTransform(scrollY, [0, 1000], [0, -200])

    // Aggiungi al carrello
    const addToCart = (product) => {
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.id === product.id)
        if (existingItem) {
          return prevCart.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
        return [...prevCart, { ...product, quantity: 1 }]
      })
    }

    // Aggiorna quantità
    const updateQuantity = (productId, newQuantity) => {
      if (newQuantity === 0) {
        setCart(prevCart => prevCart.filter(item => item.id !== productId))
      } else {
        setCart(prevCart =>
          prevCart.map(item =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
          )
        )
      }
    }

    // Calcola totale
    const getTotal = () => {
      return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    }

    // Gestisci checkout
    const handleCheckout = async () => {
      setIsLoading(true)
      try {
        const session = await createCheckoutSession(cart)
        // Redirect to Stripe Checkout
        window.location.href = session.url
      } catch (error) {
        console.error('Errore checkout:', error)
        alert('Errore durante il checkout. Riprova.')
      } finally {
        setIsLoading(false)
      }
    }

    return (
      <div className="min-h-screen bg-background">
        {/* Navbar */}
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
            
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Button>
          </div>
        </motion.nav>

        {/* Hero Section con Parallax */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <motion.div
            style={{ y: heroY }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 z-10" />
            <img
              src="https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1920&auto=format&fit=crop&q=80"
              alt="Hero"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            style={{ opacity: heroOpacity }}
            className="relative z-20 text-center px-4"
          >
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              Premium Smartphones
            </motion.h1>
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-muted-foreground mb-8"
            >
              Scopri il futuro nelle tue mani
            </motion.p>
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button size="lg" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
                Esplora Prodotti
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <ChevronDown className="h-8 w-8 text-muted-foreground" />
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <Truck className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">Spedizione Gratuita</h3>
                <p className="text-muted-foreground">Su tutti gli ordini sopra €500</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-center"
              >
                <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">Garanzia 2 Anni</h3>
                <p className="text-muted-foreground">Protezione completa inclusa</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center"
              >
                <Star className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">Prodotti Premium</h3>
                <p className="text-muted-foreground">Solo i migliori brand</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section id="products" className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">I Nostri Smartphone</h2>
              <p className="text-xl text-muted-foreground">
                Scopri la nostra selezione di dispositivi premium
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-card rounded-lg overflow-hidden shadow-lg cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{product.brand}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.features.slice(0, 2).map((feature, idx) => (
                        <span key={idx} className="text-xs bg-secondary px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold">€{product.price}</p>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          addToCart(product)
                        }}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Aggiungi
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Parallax Section */}
        <section className="relative h-[60vh] overflow-hidden">
          <motion.div
            style={{ y: parallaxY }}
            className="absolute inset-0"
          >
            <img
              src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1920&auto=format&fit=crop&q=80"
              alt="Technology"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </motion.div>

          <div className="relative z-10 h-full flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center px-4"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Innovazione a Portata di Mano
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Tecnologia all'avanguardia per migliorare la tua vita digitale
              </p>
            </motion.div>
          </div>
        </section>

        {/* Product Detail Modal */}
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedProduct && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedProduct.name}</DialogTitle>
                </DialogHeader>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="aspect-square overflow-hidden rounded-lg">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-muted-foreground mb-2">{selectedProduct.brand}</p>
                      <p className="text-lg">{selectedProduct.description}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Caratteristiche principali:</h4>
                      <ul className="space-y-1">
                        {selectedProduct.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-primary rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-3xl font-bold">€{selectedProduct.price}</p>
                        <Button onClick={() => {
                          addToCart(selectedProduct)
                          setSelectedProduct(null)
                        }}>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Aggiungi al Carrello
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Cart Modal */}
        <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Carrello</DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4 max-h-[400px] overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Il tuo carrello è vuoto
                </p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">€{item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => updateQuantity(item.id, 0)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Totale:</span>
                    <span className="text-2xl font-bold">€{getTotal()}</span>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={handleCheckout}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>Elaborazione...</>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Procedi al Pagamento
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Footer */}
        <footer className="bg-secondary/20 py-12 mt-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Smartphone className="h-6 w-6" />
                  <h3 className="text-lg font-bold">TechStore</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Il tuo negozio di fiducia per smartphone premium.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Prodotti</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>iPhone</li>
                  <li>Samsung Galaxy</li>
                  <li>Google Pixel</li>
                  <li>OnePlus</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Assistenza</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Contattaci</li>
                  <li>Spedizioni</li>
                  <li>Resi</li>
                  <li>Garanzia</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Seguici</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Facebook</li>
                  <li>Instagram</li>
                  <li>Twitter</li>
                  <li>YouTube</li>
                </ul>
              </div>
            </div>
            <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
              <p>&copy; 2024 TechStore. Tutti i diritti riservati.</p>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  export default App
