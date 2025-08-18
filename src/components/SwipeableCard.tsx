import { ReactNode } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { SwipeActions } from './SwipeActions';

interface SwipeableCardProps {
  children: ReactNode;
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  onDoubleTab?: () => void;
  rightAction?: {
    icon: ReactNode;
    label: string;
    color: string;
    bgColor: string;
  };
  leftAction?: {
    icon: ReactNode;
    label: string;
    color: string;
    bgColor: string;
  };
  swipeThreshold?: number;
  className?: string;
  disabled?: boolean;
}

export function SwipeableCard({
  children,
  onSwipeRight,
  onSwipeLeft,
  onDoubleTab,
  rightAction,
  leftAction,
  swipeThreshold = 100,
  className = '',
  disabled = false
}: SwipeableCardProps) {
  const x = useMotionValue(0);
  const rotateZ = useTransform(x, [-150, 0, 150], [-5, 0, 5]);
  const opacity = useTransform(x, [-150, -50, 0, 50, 150], [0.8, 1, 1, 1, 0.8]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (disabled) return;

    const swipeDistance = info.offset.x;
    const swipeVelocity = info.velocity.x;

    // Swipe right (positive values)
    if (swipeDistance > swipeThreshold || swipeVelocity > 500) {
      if (onSwipeRight) {
        onSwipeRight();
      }
    }
    // Swipe left (negative values)  
    else if (swipeDistance < -swipeThreshold || swipeVelocity < -500) {
      if (onSwipeLeft) {
        onSwipeLeft();
      }
    }

    // Reset position
    x.set(0);
  };

  const handleDoubleTab = () => {
    if (disabled) return;
    if (onDoubleTab) {
      onDoubleTab();
    }
  };

  const showRightAction = x.get() > 20;
  const showLeftAction = x.get() < -20;

  return (
    <div className="relative overflow-hidden">
      {/* Background Actions */}
      <SwipeActions 
        rightAction={rightAction}
        leftAction={leftAction}
        showRight={showRightAction}
        showLeft={showLeftAction}
      />
      
      {/* Draggable Card */}
      <motion.div
        drag={disabled ? false : "x"}
        dragConstraints={{ left: -200, right: 200 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        onTap={undefined}
        onTapStart={(e) => {
          // Handle double tap
          const target = e.target as HTMLElement;
          const clickCount = parseInt(target.dataset.clickCount || '0') + 1;
          target.dataset.clickCount = clickCount.toString();
          
          if (clickCount === 1) {
            setTimeout(() => {
              target.dataset.clickCount = '0';
            }, 300);
          } else if (clickCount === 2) {
            handleDoubleTab();
            target.dataset.clickCount = '0';
          }
        }}
        style={{ 
          x, 
          rotateZ, 
          opacity,
          touchAction: 'pan-y' // Allow vertical scrolling
        }}
        className={`cursor-grab active:cursor-grabbing select-none ${className}`}
        whileTap={{ scale: 0.98 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30 
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}