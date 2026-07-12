import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const modalVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.94, y: 10, transition: { duration: 0.15 } },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const Modal = ({ isOpen, onClose, title, children, size = 'md', showClose = true }) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className={`card w-full ${sizes[size]} max-h-[90vh] overflow-hidden flex flex-col`}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={e => e.stopPropagation()}
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
              {showClose && (
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <X size={16} />
                </motion.button>
              )}
            </div>
            {/* Body */}
            <div className="overflow-y-auto flex-1">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
