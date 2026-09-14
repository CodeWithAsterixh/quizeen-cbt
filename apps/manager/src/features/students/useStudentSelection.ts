import { useState } from 'react';

export function useStudentSelection(filteredIds: string[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const selectedInFilter = filteredIds.filter((id) => selectedIds.has(id));
  const isAllSelected = filteredIds.length > 0 && selectedInFilter.length === filteredIds.length;

  const handleToggleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      filteredIds.forEach((id) => (isAllSelected ? next.delete(id) : next.add(id)));
      return next;
    });
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return { selectedIds, isAllSelected, handleToggleSelectAll, handleToggleSelect };
}
