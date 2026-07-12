import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';
import { filterBySearch, sortBy, paginate } from '../../utils/helpers';

// Loading skeleton row
const SkeletonRow = ({ cols }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="skeleton h-4 rounded" style={{ width: `${60 + Math.random() * 30}%` }} />
      </td>
    ))}
  </tr>
);

// Empty state
const EmptyState = ({ message = 'No data found', icon }) => (
  <tr>
    <td colSpan={100}>
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: 'var(--bg-surface-2)' }}>
          {icon || (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              style={{ color: 'var(--text-muted)' }}>
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="3" y1="15" x2="21" y2="15" />
            </svg>
          )}
        </div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{message}</p>
      </div>
    </td>
  </tr>
);

const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  searchKeys = [],
  searchPlaceholder = 'Search...',
  filters = [], // [{ key, label, options: [{label, value}] }]
  pageSize = 10,
  emptyMessage = 'No records found',
  onRowClick,
  actions, // React node for action buttons in toolbar
}) => {
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);

  // Filter + search + sort
  const processed = useMemo(() => {
    let items = [...data];

    // Apply dropdown filters
    Object.entries(activeFilters).forEach(([key, val]) => {
      if (val && val !== '') {
        items = items.filter(item => String(item[key]) === String(val));
      }
    });

    // Apply search
    if (search && searchKeys.length > 0) {
      items = filterBySearch(items, search, searchKeys);
    }

    // Apply sort
    if (sortKey) {
      items = sortBy(items, sortKey, sortDir);
    }

    return items;
  }, [data, search, activeFilters, sortKey, sortDir, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(processed.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageData = paginate(processed, currentPage, pageSize);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  };

  const handleSearch = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handleFilter = (key, val) => {
    setActiveFilters(prev => ({ ...prev, [key]: val }));
    setPage(1);
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearch('');
    setPage(1);
  };

  const hasActiveFilters = search || Object.values(activeFilters).some(v => v);

  return (
    <div className="card overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
        {/* Search */}
        {searchKeys.length > 0 && (
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={e => handleSearch(e.target.value)}
              className="input pl-9 pr-4 h-9 text-sm"
            />
          </div>
        )}

        {/* Dropdown Filters */}
        {filters.map(f => (
          <div key={f.key} className="flex items-center gap-1.5">
            <Filter size={13} style={{ color: 'var(--text-muted)' }} />
            <select
              value={activeFilters[f.key] || ''}
              onChange={e => handleFilter(f.key, e.target.value)}
              className="input h-9 py-0 pr-8 text-sm cursor-pointer"
              style={{ minWidth: 130 }}
            >
              <option value="">{f.label}: All</option>
              {f.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        ))}

        {/* Clear filters */}
        {hasActiveFilters && (
          <button onClick={clearFilters} className="btn-ghost h-9 px-3 text-xs gap-1.5">
            <X size={12} /> Clear
          </button>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Record count */}
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {processed.length} record{processed.length !== 1 ? 's' : ''}
        </span>

        {/* Actions */}
        {actions}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={col.key || col.label}
                  onClick={col.sortable !== false && col.key ? () => handleSort(col.key) : undefined}
                  className={col.sortable !== false && col.key ? 'cursor-pointer select-none hover:text-primary-color group' : ''}
                  style={{ width: col.width }}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable !== false && col.key && (
                      <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {sortKey === col.key ? (
                          sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                        ) : (
                          <ChevronUp size={12} style={{ opacity: 0.4 }} />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} cols={columns.length} />
              ))
            ) : pageData.length === 0 ? (
              <EmptyState message={emptyMessage} />
            ) : (
              <AnimatePresence mode="wait">
                {pageData.map((row, i) => (
                  <motion.tr
                    key={row.id || i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.2 }}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={onRowClick ? 'cursor-pointer' : ''}
                  >
                    {columns.map(col => (
                      <td key={col.key || col.label}>
                        {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && processed.length > pageSize && (
        <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Page {currentPage} of {totalPages} · {processed.length} results
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="btn-ghost p-1.5 rounded-lg disabled:opacity-40"
            >
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let p;
              if (totalPages <= 5) p = i + 1;
              else if (currentPage <= 3) p = i + 1;
              else if (currentPage >= totalPages - 2) p = totalPages - 4 + i;
              else p = currentPage - 2 + i;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className="w-7 h-7 rounded-lg text-xs font-medium transition-colors"
                  style={{
                    background: currentPage === p ? 'var(--primary)' : 'transparent',
                    color: currentPage === p ? '#fff' : 'var(--text-secondary)',
                  }}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="btn-ghost p-1.5 rounded-lg disabled:opacity-40"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
