import { motion } from "framer-motion"

const spinTransition = {
  repeat: Infinity,
  ease: "easeInOut",
  duration: 1,
}

const Spinner = () => {
  return (
    <div className="flex w-full h-full z-50 dark:bg-dark">
      <div className="relative w-12 h-12">
        <motion.span
          className="block w-12 h-12 border-4 border-gray-300 border-t-4 border-t-gray-800 rounded-full absolute top-0 left-0"
          animate={{ rotate: 360 }}
          transition={spinTransition}
        />
      </div>
    </div>
  )
}
export default Spinner
