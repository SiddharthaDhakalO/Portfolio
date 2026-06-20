'use client';

import { motion } from 'framer-motion';

type Props = {
  size?: string;
  spin?: boolean;
  spinSeconds?: number;
};

export default function ConcentricRings({
  size = 'min(640px, 90vw)',
  spin = true,
  spinSeconds = 240,
}: Props) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="-260 -260 520 520"
      animate={spin ? { rotate: 360 } : undefined}
      transition={
        spin
          ? { duration: spinSeconds, ease: 'linear', repeat: Infinity }
          : undefined
      }
      aria-hidden
      style={{ display: 'block' }}
    >
      <circle cx="0" cy="0" r="250" fill="none" stroke="#C9A961" strokeWidth="0.5" opacity="0.12" />
      <circle cx="0" cy="0" r="205" fill="none" stroke="#C9A961" strokeWidth="0.5" opacity="0.2" />
      <circle cx="0" cy="0" r="155" fill="none" stroke="#C9A961" strokeWidth="0.6" opacity="0.32" />
      <circle cx="0" cy="0" r="105" fill="none" stroke="#C9A961" strokeWidth="0.8" opacity="0.5" />
      <circle cx="0" cy="0" r="58" fill="none" stroke="#C9A961" strokeWidth="1.2" opacity="0.72" />
      <circle cx="0" cy="0" r="20" fill="none" stroke="#C9A961" strokeWidth="1.5" opacity="0.95" />
    </motion.svg>
  );
}
