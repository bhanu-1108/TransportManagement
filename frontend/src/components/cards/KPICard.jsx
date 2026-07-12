import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * Animated number counter hook
 */
const useCounter = (end, duration = 1200, start = 0) => {
  const [count, setCount] = useState(start);
  const frameRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(start + (end - start) * eased));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [end, duration, start]);

  return count;
};

const KPICard = ({
  title,
  value,
  icon: Icon,
  trend,         // number, positive = up, negative = down
  trendLabel,
  color = 'primary',
  prefix = '',
  suffix = '',
  loading = false,
  delay = 0,
  onClick,
}) => {
  const numericValue = parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;
  const animatedValue = useCounter(numericValue, 1200);

  const colorMap = {
    primary: { bg: 'rgba(135,90,123,0.1)', iconBg: 'rgba(135,90,123,0.15)', color: '#875A7B', border: 'rgba(135,90,123,0.2)' },
    success: { bg: 'rgba(34,197,94,0.08)', iconBg: 'rgba(34,197,94,0.15)', color: '#22C55E', border: 'rgba(34,197,94,0.2)' },
    warning: { bg: 'rgba(245,158,11,0.08)', iconBg: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: 'rgba(245,158,11,0.2)' },
    danger: { bg: 'rgba(239,68,68,0.08)', iconBg: 'rgba(239,68,68,0.15)', color: '#EF4444', border: 'rgba(239,68,68,0.2)' },
    info: { bg: 'rgba(59,130,246,0.08)', iconBg: 'rgba(59,130,246,0.15)', color: '#3B82F6', border: 'rgba(59,130,246,0.2)' },
  };

  const { bg, iconBg, color: iconColor, border } = colorMap[color] || colorMap.primary;

  if (loading) {
    return (
      <div className="card p-5">
        <div className="skeleton h-4 w-24 rounded mb-3" />
        <div className="skeleton h-8 w-16 rounded mb-2" />
        <div className="skeleton h-3 w-20 rounded" />
      </div>
    );
  }

  const displayValue = typeof value === 'string' && value.includes('%')
    ? `${animatedValue}%`
    : typeof value === 'string' && value.startsWith('₹')
    ? `₹${animatedValue.toLocaleString('en-IN')}`
    : String(value).includes('.')
    ? value
    : animatedValue.toLocaleString('en-IN');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`card p-5 relative overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
      style={{
        background: `linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface) 70%)`,
      }}
    >
      {/* Background accent */}
      <div className="absolute inset-0 opacity-40 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top right, ${bg} 0%, transparent 70%)` }} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <p className="stat-label">{title}</p>
          {Icon && (
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: iconBg, border: `1px solid ${border}` }}>
              <Icon size={18} style={{ color: iconColor }} />
            </div>
          )}
        </div>

        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="stat-value">
              {prefix}{displayValue}{suffix}
            </div>
            {trend !== undefined && trendLabel && (
              <div className="flex items-center gap-1 mt-1.5">
                {trend > 0 ? (
                  <TrendingUp size={12} className="text-green-500" />
                ) : trend < 0 ? (
                  <TrendingDown size={12} className="text-red-500" />
                ) : (
                  <Minus size={12} style={{ color: 'var(--text-muted)' }} />
                )}
                <span className="text-2xs font-medium"
                  style={{ color: trend > 0 ? '#16a34a' : trend < 0 ? '#dc2626' : 'var(--text-muted)' }}>
                  {trend > 0 ? '+' : ''}{trend}% {trendLabel}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl"
        style={{ background: `linear-gradient(90deg, ${iconColor}40, transparent)` }} />
    </motion.div>
  );
};

export default KPICard;
