import { motion } from "framer-motion";

export default function PageWrapper({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`max-w-6xl mx-auto px-6 py-10 ${className}`}
    >
      {children}
    </motion.div>
  );
}
