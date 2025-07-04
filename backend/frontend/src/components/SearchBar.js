import React, { useState } from 'react';

const SearchBar = ({ 
  onSearch, 
  onFilter, 
  onSort,
  placeholder = "Search products...",
  maxPrice = 1000 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, maxPrice]);
  const [sortOption, setSortOption] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Categories from the product seeder
  const categories = [
    'Electronics',
    'Gaming', 
    'Photography',
    'Home & Kitchen',
    'Fashion'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  const handlePriceChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(value) || 0;
    setPriceRange(newRange);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const applyFilters = () => {
    onFilter && onFilter({ 
      priceRange, 
      category: selectedCategory 
    });
  };

  const handleSortChange = (value) => {
    setSortOption(value);
    onSort && onSort(value);
  };

  const resetFilters = () => {
    setPriceRange([0, maxPrice]);
    setSortOption('');
    setSelectedCategory('');
    onFilter && onFilter({ 
      priceRange: [0, maxPrice], 
      category: '' 
    });
    onSort && onSort('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.searchForm}>
        <div style={styles.inputWrapper}>
          <div style={styles.searchIcon}>🔍</div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            style={styles.input}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              style={styles.clearButton}
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>
        
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          style={{
            ...styles.filterToggle,
            ...(showFilters ? styles.filterToggleActive : {})
          }}
          title="Toggle filters"
        >
          ☰
        </button>
        
        <button 
          type="button" 
          onClick={handleSubmit}
          style={styles.searchButton}
        >
          Search
        </button>
      </div>

      {showFilters && (
        <div style={styles.filtersPanel}>
          <div style={styles.filterRow}>
            <div style={styles.categoryFilter}>
              <label style={styles.filterLabel}>Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                style={styles.categorySelect}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.priceFilter}>
              <label style={styles.filterLabel}>Price Range</label>
              <div style={styles.priceInputs}>
                <div style={styles.priceInputGroup}>
                  <span style={styles.currencySymbol}>$</span>
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(0, e.target.value)}
                    style={styles.priceInput}
                    placeholder="Min"
                    min="0"
                  />
                </div>
                <span style={styles.priceSeparator}>-</span>
                <div style={styles.priceInputGroup}>
                  <span style={styles.currencySymbol}>$</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(1, e.target.value)}
                    style={styles.priceInput}
                    placeholder="Max"
                    min="0"
                  />
                </div>
              </div>
            </div>
            
            <div style={styles.sortFilter}>
              <label style={styles.filterLabel}>Sort By</label>
              <select
                value={sortOption}
                onChange={(e) => handleSortChange(e.target.value)}
                style={styles.sortSelect}
              >
                <option value="">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
            
            <div style={styles.actionButtons}>
              <button
                type="button"
                onClick={applyFilters}
                style={styles.applyButton}
                title="Apply filters"
              >
                Apply Filters
              </button>
              
              <button
                type="button"
                onClick={resetFilters}
                style={styles.resetButton}
                title="Reset filters"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    margin: '0 auto 2rem auto',
    maxWidth: '900px',
    padding: '0 2rem'
  },
  searchForm: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '0.75rem 1rem',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    height: '48px'
  },
  inputWrapper: {
    position: 'relative',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    height: '100%'
  },
  searchIcon: {
    position: 'absolute',
    left: '0.75rem',
    fontSize: '0.95rem',
    color: '#667eea',
    zIndex: 1,
    pointerEvents: 'none'
  },
  input: {
    width: '100%',
    padding: '0.5rem 2.5rem 0.5rem 2.25rem',
    border: 'none',
    borderRadius: '12px',
    fontSize: '0.9rem',
    outline: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    color: '#2c3e50',
    fontWeight: '500',
    height: '32px'
  },
  clearButton: {
    position: 'absolute',
    right: '0.5rem',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '22px',
    height: '22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    border: 'none',
    borderRadius: '50%',
    fontSize: '1rem',
    cursor: 'pointer',
    color: '#667eea',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontWeight: 'bold'
  },
  filterToggle: {
    padding: '0.5rem',
    background: 'rgba(255, 255, 255, 0.9)',
    color: '#667eea',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 2px 8px rgba(255, 255, 255, 0.2)',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  filterToggleActive: {
    background: 'linear-gradient(135deg, #ffffff, #f8f9fa)',
    transform: 'scale(1.05)'
  },
  searchButton: {
    padding: '0.5rem 1.25rem',
    background: 'linear-gradient(135deg, #ffffff, #f8f9fa)',
    color: '#667eea',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 2px 8px rgba(255, 255, 255, 0.2)',
    minWidth: '80px',
    height: '32px'
  },
  filtersPanel: {
    marginTop: '1rem',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    animation: 'slideDown 0.3s ease-out'
  },
  filterRow: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'flex-end',
    flexWrap: 'wrap'
  },
  categoryFilter: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    minWidth: '160px'
  },
  categorySelect: {
    padding: '0.5rem 0.75rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '0.85rem',
    outline: 'none',
    backgroundColor: '#ffffff',
    color: '#2c3e50',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  priceFilter: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    minWidth: '200px'
  },
  filterLabel: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: '0.25rem'
  },
  priceInputs: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  priceInputGroup: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  currencySymbol: {
    position: 'absolute',
    left: '0.5rem',
    fontSize: '0.85rem',
    color: '#667eea',
    fontWeight: '600',
    zIndex: 1
  },
  priceInput: {
    width: '80px',
    padding: '0.5rem 0.5rem 0.5rem 1.25rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '0.85rem',
    outline: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: '#ffffff',
    color: '#2c3e50'
  },
  priceSeparator: {
    color: '#667eea',
    fontWeight: '600',
    fontSize: '0.9rem'
  },
  sortFilter: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    minWidth: '180px'
  },
  sortSelect: {
    padding: '0.5rem 0.75rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '0.85rem',
    outline: 'none',
    backgroundColor: '#ffffff',
    color: '#2c3e50',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    alignItems: 'flex-end'
  },
  applyButton: {
    padding: '0.5rem 1rem',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
    minWidth: '100px',
    height: '34px'
  },
  resetButton: {
    padding: '0.5rem 1rem',
    background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)',
    minWidth: '70px',
    height: '34px'
  }
};

// Add CSS animation for the slide-down effect
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(styleSheet);

export default SearchBar;