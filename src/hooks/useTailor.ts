// src/hooks/useTailor.ts
import { useTailorStore } from '@/store/tailorStore'

export const useTailor = () => {
  const {
    tailors,
    filteredTailors,
    filters,
    isLoading,
    error,
    selectedTailor,
    searchQuery,
    sortBy,
    loadTailors,
    setFilters,
    setSearchQuery,
    setSortBy,
    selectTailor,
    clearFilters,
    applyFilters
  } = useTailorStore()
  
  return {
    // State
    tailors,
    filteredTailors,
    filters,
    isLoading,
    error,
    selectedTailor,
    searchQuery,
    sortBy,
    
    // Computed
    totalTailors: tailors.length,
    filteredCount: filteredTailors.length,
    hasFilters: Object.keys(filters).length > 0 || searchQuery.length > 0,
    
    // Actions
    loadTailors,
    setFilters,
    setSearchQuery,
    setSortBy,
    selectTailor,
    clearFilters,
    applyFilters
  }
}
