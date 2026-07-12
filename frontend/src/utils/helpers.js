// ===== DATE & TIME HELPERS =====
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

export const formatRelativeTime = (dateStr) => {
  if (!dateStr) return '—';
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
};

export const isExpiringSoon = (dateStr, days = 30) => {
  if (!dateStr) return false;
  const expiry = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
  return diffDays <= days && diffDays >= 0;
};

export const isExpired = (dateStr) => {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
};

// ===== CURRENCY =====
export const formatCurrency = (amount, currency = 'INR') => {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num) => {
  if (num === null || num === undefined) return '—';
  return new Intl.NumberFormat('en-IN').format(num);
};

// ===== PERCENTAGE =====
export const formatPercent = (value, decimals = 1) => {
  if (value === null || value === undefined) return '—';
  return `${Number(value).toFixed(decimals)}%`;
};

// ===== DISTANCE =====
export const formatDistance = (km) => {
  if (km === null || km === undefined) return '—';
  return `${formatNumber(km)} km`;
};

// ===== FUEL EFFICIENCY =====
export const calcFuelEfficiency = (distanceKm, fuelLiters) => {
  if (!fuelLiters || fuelLiters === 0) return 0;
  return (distanceKm / fuelLiters).toFixed(2);
};

// ===== VEHICLE ROI =====
export const calcVehicleROI = (revenue, maintenance, fuel, acquisitionCost) => {
  if (!acquisitionCost || acquisitionCost === 0) return 0;
  return (((revenue - (maintenance + fuel)) / acquisitionCost) * 100).toFixed(2);
};

// ===== CSV EXPORT =====
export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(h => {
        const val = row[h];
        if (val === null || val === undefined) return '';
        const str = String(val);
        return str.includes(',') ? `"${str}"` : str;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// ===== TRUNCATE =====
export const truncate = (str, maxLen = 30) => {
  if (!str) return '';
  return str.length > maxLen ? str.substring(0, maxLen) + '…' : str;
};

// ===== CAPITALIZE =====
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// ===== SEARCH FILTER =====
export const filterBySearch = (items, query, keys) => {
  if (!query) return items;
  const q = query.toLowerCase();
  return items.filter(item =>
    keys.some(key => {
      const val = item[key];
      return val && String(val).toLowerCase().includes(q);
    })
  );
};

// ===== SORT HELPER =====
export const sortBy = (items, key, direction = 'asc') => {
  return [...items].sort((a, b) => {
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

// ===== PAGINATE =====
export const paginate = (items, page, perPage) => {
  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
};

// ===== RANDOM ID =====
export const generateId = (prefix = 'ID') => {
  return `${prefix}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
};
