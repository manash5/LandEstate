import { motion } from 'framer-motion'

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-[#F7FBFF] flex flex-col items-center justify-center z-[9999]">
      <div className="">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="mb-8"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-16 h-16 " xmlns="http://www.w3.org/2000/svg">
            <motion.path 
              d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" 
              stroke="#F9A826" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.path 
              d="M9 22V12H15V22" 
              stroke="#F9A826" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
          </svg>
        </motion.div>
      </div>
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="font-heading text-4xl font-bold"
      >
        <span className="text-[#0F6D94]">Land</span>
        <span className="text-[#00B4D8]">Estate</span>
      </motion.h1>
      {/* <div className="w-50 h-1 bg-neutral-200  text-black rounded-full mt-2 overflow-hidden">
        <motion.div 
          className="h-full bg-[#138BBC] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
      </div> */}
      
    </div>
  )
}

export default LoadingScreen