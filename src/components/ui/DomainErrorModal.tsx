import { motion, AnimatePresence } from 'motion/react'
import { MdOutlineBlock } from 'react-icons/md'
import { FaGoogle } from 'react-icons/fa'

interface Props {
  message: string | null
  onDismiss: () => void
}

export function DomainErrorModal({ message, onDismiss }: Props) {
  return (
    <AnimatePresence>
      {message && (
        <>
          {/* backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onDismiss}
          />

          {/* modal */}
          <motion.div
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="glass-panel border border-error/40 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl shadow-error/20">
              <div className="w-16 h-16 rounded-full bg-error/20 border border-error/40 flex items-center justify-center mx-auto mb-5">
                <MdOutlineBlock size={32} className="text-error" />
              </div>

              <h2 className="font-headline-md text-headline-md text-error uppercase mb-3">
                Cuenta no permitida
              </h2>

              <p className="text-on-surface-variant text-sm leading-relaxed mb-2">
                {message}
              </p>

              <div className="mt-4 mb-6 bg-surface-container-low rounded-xl px-4 py-3 flex items-center gap-3">
                <FaGoogle size={16} className="text-on-surface-variant flex-shrink-0" />
                <p className="text-xs text-on-surface-variant text-left">
                  Usá tu cuenta personal <span className="text-primary font-semibold">@gmail.com</span> para participar del concurso.
                </p>
              </div>

              <button
                onClick={onDismiss}
                className="btn-primary w-full"
              >
                Entendido
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
