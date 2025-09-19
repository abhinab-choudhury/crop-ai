import { motion } from 'motion/react';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import './footer.css';
export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-950 border-t border-green-200 dark:border-gray-700 py-20">
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none">
        <svg
          className="relative block w-full h-24 text-green-50 dark:text-gray-900"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V56.44Z"
            className="fill-current"
          ></path>
        </svg>
      </div>

      <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        {/* Transforming Agriculture with AI Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-14 shadow-lg border border-green-100 dark:border-gray-700 mb-32" // Increased from mb-20 to mb-32
        >
          <h3 className="text-4xl font-bold text-green-800 dark:text-green-300 mb-14 text-center">
            Transforming Agriculture with AI
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Impact Stat 1 */}
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-md border border-green-100 dark:border-gray-700 text-center"
            >
              <div className="text-6xl font-bold text-green-600 mb-6">30%</div>
              <p className="text-gray-600 dark:text-gray-300 text-xl font-medium leading-tight">
                Increase in crop yield prediction accuracy
              </p>
            </motion.div>

            {/* Impact Stat 2 */}
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-md border border-green-100 dark:border-gray-700 text-center"
            >
              <div className="text-6xl font-bold text-green-600 mb-6">95%</div>
              <p className="text-gray-600 dark:text-gray-300 text-xl font-medium leading-tight">
                Disease detection accuracy with AI analysis
              </p>
            </motion.div>

            {/* Impact Stat 3 */}
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-md border border-green-100 dark:border-gray-700 text-center"
            >
              <div className="text-6xl font-bold text-green-600 mb-6">50+</div>
              <p className="text-gray-600 dark:text-gray-300 text-xl font-medium leading-tight">
                Crop varieties supported in our system
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content Grid - Shifted to the right with offset */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 ml-0 md:ml-8 lg:ml-16 mt-12">
          {' '}
          {/* Added mt-12 for extra top margin */}
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <div className="flex items-center justify-center md:justify-start mb-8">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
              >
                <span className="text-6xl text-green-600 mr-4">🌱</span>
              </motion.div>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                CropAI
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-xl leading-relaxed mb-8">
              Crop AI provides real-time crop suggestions, plant health analysis — all through a
              simple, farmer-friendly chat interface.
            </p>

            <div className="space-y-4">
              <div className="flex items-center text-gray-600 dark:text-gray-400 text-xl">
                <FaEnvelope className="text-green-600 mr-4 text-2xl flex-shrink-0" />
                <span>contact@cropai.tech</span>
              </div>
              <div className="flex items-start text-gray-600 dark:text-gray-400 text-xl">
                <FaMapMarkerAlt className="text-green-600 mr-4 mt-1 text-2xl flex-shrink-0" />
                <span>Smart India Hackathon 2025</span>
              </div>
            </div>
          </motion.div>
          {/* Quick Links Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <h3 className="font-semibold text-green-800 dark:text-green-400 text-2xl mb-8 relative inline-block">
              Quick Links
              <span className="absolute -bottom-3 left-0 w-16 h-1.5 bg-green-500 rounded-full"></span>
            </h3>

            <div className="space-y-6">
              <motion.a
                href="#hero"
                whileHover={{ x: 8 }}
                className="block text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 transition-colors text-xl font-medium"
              >
                Home
              </motion.a>
              <motion.a
                href="#features"
                whileHover={{ x: 8 }}
                className="block text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 transition-colors text-xl font-medium"
              >
                Features
              </motion.a>
            </div>
          </motion.div>
          {/* Connect with us Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <h3 className="font-semibold text-green-800 dark:text-green-400 text-2xl mb-8 relative inline-block">
              Connect with us
              <span className="absolute -bottom-3 left-0 w-16 h-1.5 bg-green-500 rounded-full"></span>
            </h3>

            <div className="flex justify-center md:justify-start space-x-6">
              {[
                {
                  icon: FaGithub,
                  href: 'https://github.com/abhinab-choudhury/crop-ai',
                  label: 'GitHub',
                },
                {
                  icon: FaLinkedin,
                  href: 'https://linkedin.com/company/your-linkedin',
                  label: 'LinkedIn',
                },
                { icon: FaTwitter, href: 'https://twitter.com/your-twitter', label: 'Twitter' },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -6, scale: 1.1 }}
                  className="bg-white dark:bg-gray-800 text-green-600 p-5 rounded-full shadow-md hover:shadow-xl transition-all border border-green-100 dark:border-gray-700"
                  aria-label={social.label}
                >
                  <social.icon size={26} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
