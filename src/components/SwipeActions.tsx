import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SwipeAction {
  icon: ReactNode;
  label: string;
  color: string;
  bgColor: string;
}

interface SwipeActionsProps {
  rightAction?: SwipeAction;
  leftAction?: SwipeAction;
  showRight: boolean;
  showLeft: boolean;
}

export function SwipeActions({ 
  rightAction, 
  leftAction, 
  showRight, 
  showLeft 
}: SwipeActionsProps) {
  return (
    <>
      {/* Right Action (Swipe Right) */}
      <AnimatePresence>
        {rightAction && showRight && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
          >
            <div 
              className="flex items-center gap-2 px-3 py-2 rounded-full shadow-lg"
              style={{ 
                backgroundColor: rightAction.bgColor,
                color: rightAction.color 
              }}
            >
              {rightAction.icon}
              <span className="text-sm font-medium whitespace-nowrap">
                {rightAction.label}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Action (Swipe Left) */}
      <AnimatePresence>
        {leftAction && showLeft && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
          >
            <div 
              className="flex items-center gap-2 px-3 py-2 rounded-full shadow-lg"
              style={{ 
                backgroundColor: leftAction.bgColor,
                color: leftAction.color 
              }}
            >
              {leftAction.icon}
              <span className="text-sm font-medium whitespace-nowrap">
                {leftAction.label}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Gradient Indicators */}
      <AnimatePresence>
        {showRight && rightAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(to right, ${rightAction.bgColor}20, transparent 50%)`
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLeft && leftAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(to left, ${leftAction.bgColor}20, transparent 50%)`
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}