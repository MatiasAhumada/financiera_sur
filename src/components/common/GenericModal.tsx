"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Cancel01Icon } from "hugeicons-react";
import { useReducedMotion } from "framer-motion";
import type {
  GenericModalProps,
  ConfirmModalProps,
} from "@/interfaces/modal.interface";

const SIZE_CLASSES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
};

export function GenericModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "md",
  variant = "default",
}: GenericModalProps) {
  const isDark = variant === "dark";
  const shouldReduceMotion = useReducedMotion();

  const bgClass = isDark ? "bg-[#0B274E] text-white" : "bg-[#F8F5EE] text-[#0B274E]";
  const headerBgClass = isDark ? "bg-[#0B274E]" : "bg-white/60";
  const footerBgClass = isDark ? "bg-[#0B274E]" : "bg-[#F0EBDD]";
  const contentBgClass = isDark ? "bg-[#0B274E]" : "bg-[#F8F5EE]";

  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            variants={shouldReduceMotion ? undefined : backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            variants={shouldReduceMotion ? undefined : modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
            className={`${bgClass} border ${isDark ? "border-white/15" : "border-[#0B274E]/10"} rounded-[1.75rem] shadow-[0_30px_90px_rgba(11,39,78,.24)] ${SIZE_CLASSES[size]} w-full max-h-[90vh] overflow-y-auto pointer-events-auto`}
            >
              <div
                className={`flex items-center justify-between p-6 border-b ${isDark ? "border-white/10" : "border-[#0B274E]/10"} ${headerBgClass}`}
              >
                <div>
                  <h2 className="font-serif text-3xl tracking-[-.02em]">{title}</h2>
                  {description && (
                    <p className={`mt-2 text-sm ${isDark ? "text-white/60" : "text-[#0B274E]/55"}`}>
                      {description}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenChange(false)}
                  className={`rounded-full ${isDark ? "text-white/60 hover:bg-white/10 hover:text-white" : "text-[#0B274E]/45 hover:bg-[#0B274E]/10 hover:text-[#0B274E]"}`}
                >
                  <Cancel01Icon size={20} />
                </Button>
              </div>
              <div className={`p-6 ${contentBgClass}`}>{children}</div>
              {footer && (
                <div
                  className={`flex justify-end gap-3 p-6 border-t ${isDark ? "border-white/10" : "border-[#0B274E]/10"} ${footerBgClass}`}
                >
                  {footer}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "default",
  loading = false,
}: ConfirmModalProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <GenericModal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={handleConfirm} disabled={loading}>
            {loading ? "Procesando..." : confirmText}
          </Button>
        </>
      }
    >
      <p className="text-sm leading-6 text-[#0B274E]/65">{description}</p>
    </GenericModal>
  );
}
