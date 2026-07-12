import { STATUS_BADGE_CLASS, ROLE_COLORS, ROLE_LABELS } from '../../utils/constants';

// Generic Status Badge
export const StatusBadge = ({ status, className = '' }) => {
  const cls = STATUS_BADGE_CLASS[status] || 'badge';
  return (
    <span className={`${cls} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{
        background: 'currentColor',
        opacity: 0.7,
      }} />
      {status}
    </span>
  );
};

// Role Badge
export const RoleBadge = ({ role, className = '' }) => {
  const cls = ROLE_COLORS[role] || 'badge';
  const label = ROLE_LABELS[role] || role;
  return (
    <span className={`${cls} ${className}`}>
      {label}
    </span>
  );
};

// Safety Score Badge
export const SafetyScoreBadge = ({ score }) => {
  let color, bg;
  if (score >= 90) { color = '#16a34a'; bg = 'rgba(34,197,94,0.12)'; }
  else if (score >= 80) { color = '#2563eb'; bg = 'rgba(59,130,246,0.12)'; }
  else if (score >= 70) { color = '#d97706'; bg = 'rgba(245,158,11,0.12)'; }
  else { color = '#dc2626'; bg = 'rgba(239,68,68,0.12)'; }

  return (
    <span className="badge font-semibold" style={{ color, background: bg, border: `1px solid ${color}30` }}>
      {score}/100
    </span>
  );
};

// Priority Badge
export const PriorityBadge = ({ priority }) => {
  const map = {
    high: { cls: 'badge-retired', label: 'High' },
    medium: { cls: 'badge-in-shop', label: 'Medium' },
    low: { cls: 'badge-available', label: 'Low' },
  };
  const { cls, label } = map[priority?.toLowerCase()] || map.medium;
  return <span className={cls}>{label}</span>;
};

// Notification Type Badge
export const NotifBadge = ({ type }) => {
  const map = {
    warning: 'badge-in-shop',
    danger: 'badge-retired',
    success: 'badge-available',
    info: 'badge-on-trip',
  };
  return (
    <span className={map[type] || 'badge'}>
      {type}
    </span>
  );
};

export default StatusBadge;
