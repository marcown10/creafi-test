import React from 'react'
  import { motion, useScroll, useTransform } from 'framer-motion'
  import { useInView } from 'react-intersection-observer'

  const ParallaxSection = () => {
    const { scrollY } = useScroll()
    const y = useTransform(scrollY, [0, 1000], [0, -200])
    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.1
    })

    return (
      <section className="relative h-[60vh] overflow-hidden">
        <motion.div
          style={{ y }}
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
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center px-4"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Innovation at Your Fingertips
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience cutting-edge technology with our curated selection of premium smartphones
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  export default ParallaxSection
