import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const Card = ({
  children,
  className = '',
  hover = true,
  glass = false,
  padding = true,
  onClick,
  ...props
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-300';
  
  const backgroundStyles = glass
    ? 'bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10'
    : 'bg-white dark:bg-dark-card shadow-lg dark:shadow-none border border-gray-200 dark:border-dark-border';
  
  const hoverStyles = hover && onClick
    ? 'hover:scale-105 hover:shadow-xl cursor-pointer'
    : '';
  
  const paddingStyles = padding ? 'p-6' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={clsx(
        baseStyles,
        backgroundStyles,
        hoverStyles,
        paddingStyles,
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;