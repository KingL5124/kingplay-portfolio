import { motion } from 'framer-motion';
import { FaCrown, FaGamepad, FaBook } from 'react-icons/fa';

const Hero = () => {
  return (
    <section id="home" className="min-h-screen relative overflow-hidden pixel-bg">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        <div className="text-center">
          {/* Animated Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 1 }}
            className="inline-block mb-8"
          >
            <FaCrown className="text-8xl text-red-600 animate-float" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 pixel-text"
          >
            KINGPLAY
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-12"
          >
            Diseñador Interactivo | Creador de Experiencias
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <motion.a
              href="#portfolio"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="pixel-button flex items-center justify-center gap-2"
            >
              <FaGamepad />
              Ver Portafolio
            </motion.a>
            <motion.a
              href="#novel"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="pixel-button flex items-center justify-center gap-2"
            >
              <FaBook />
              Leer Novela
            </motion.a>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-red-600 rounded-full p-1">
            <motion.div
              animate={{
                y: [0, 12, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-2 h-2 bg-red-600 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero; 