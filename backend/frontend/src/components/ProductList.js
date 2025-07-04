import React, { useState, useEffect } from 'react';
import { productAPI, cartAPI, wishlistAPI } from '../utils/api';
import SearchBar from './SearchBar';

const ProductList = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [addingToCart, setAddingToCart] = useState({});
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [failedImages, setFailedImages] = useState(new Set());
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchProducts();
    if (user) {
      fetchWishlistStatus();
    }
  }, [searchTerm, user]);

  // Auto-remove notifications after 3 seconds
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications(prev => prev.slice(1));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  const showNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = searchTerm ? { search: searchTerm } : {};
      params.limit = 100;
      params.per_page = 100;
      params.page_size = 100;
      
      const response = await productAPI.getAll(params);
      
      if (response.data.products) {
        setProducts(response.data.products);
      } else if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlistStatus = async () => {
    try {
      const response = await wishlistAPI.get();
      if (response.data && Array.isArray(response.data)) {
        const wishlistProductIds = new Set(response.data.map(item => item.productId));
        setWishlistItems(wishlistProductIds);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      showNotification('Please login to add items to cart', 'warning');
      return;
    }

    setAddingToCart(prev => ({ ...prev, [productId]: true }));
    
    try {
      await cartAPI.add(productId, 1);
      showNotification('Product added to cart successfully!', 'success');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to add product to cart';
      showNotification(errorMessage, 'error');
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleToggleWishlist = async (productId) => {
    if (!user) {
      showNotification('Please login to manage wishlist', 'warning');
      return;
    }

    try {
      if (wishlistItems.has(productId)) {
        await wishlistAPI.remove(productId);
        setWishlistItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        showNotification('Product removed from wishlist', 'info');
      } else {
        await wishlistAPI.add(productId);
        setWishlistItems(prev => new Set([...prev, productId]));
        showNotification('Product added to wishlist!', 'success');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to update wishlist';
      showNotification(errorMessage, 'error');
    }
  };

  const handleImageError = (productId) => {
    setFailedImages(prev => new Set([...prev, productId]));
  };

  const NotificationContainer = () => (
    <div style={styles.notificationContainer}>
      {notifications.map(notification => (
        <div 
          key={notification.id} 
          style={{
            ...styles.notification,
            ...styles[`notification${notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}`]
          }}
        >
          <span style={styles.notificationIcon}>
            {notification.type === 'success' && '✓'}
            {notification.type === 'error' && '✗'}
            {notification.type === 'warning' && '⚠'}
            {notification.type === 'info' && 'ℹ'}
          </span>
          {notification.message}
        </div>
      ))}
    </div>
  );

  const ProductCard = ({ product }) => (
    <div style={styles.productCard}>
      <div style={styles.imageContainer}>
        {failedImages.has(product.id) ? (
          <div style={styles.imagePlaceholder}>
            <div style={styles.placeholderIcon}>🖼️</div>
            <div style={styles.placeholderText}>Image not available</div>
          </div>
        ) : (
          <img 
            src={product.image} 
            alt={product.name} 
            style={styles.productImage}
            onError={() => handleImageError(product.id)}
            loading="lazy"
          />
        )}
        {user && (
          <button
            style={{
              ...styles.wishlistBtn,
              ...(wishlistItems.has(product.id) ? styles.wishlistActive : {})
            }}
            onClick={() => handleToggleWishlist(product.id)}
            title={wishlistItems.has(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {wishlistItems.has(product.id) ? '❤️' : '🤍'}
          </button>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <div style={styles.lowStockBadge}>Only {product.stock} left!</div>
        )}
        {product.stock === 0 && (
          <div style={styles.outOfStockBadge}>Out of Stock</div>
        )}
      </div>
      <div style={styles.productInfo}>
        <h3 style={styles.productName}>{product.name}</h3>
        <p style={styles.productDescription}>{product.description}</p>
        <div style={styles.productDetails}>
          <span style={styles.productPrice}>
            ₹{parseFloat(product.price).toFixed(2)}
          </span>
          <span style={{
            ...styles.productStock,
            color: product.stock > 10 ? '#28a745' : product.stock > 0 ? '#ffc107' : '#dc3545'
          }}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
          </span>
        </div>
        <button 
          style={{
            ...styles.buyButton,
            ...(product.stock === 0 ? styles.disabledButton : {}),
            ...(addingToCart[product.id] ? styles.loadingButton : {})
          }}
          onClick={() => handleAddToCart(product.id)}
          disabled={product.stock === 0 || addingToCart[product.id]}
        >
          {addingToCart[product.id] ? (
            <>
              <span style={styles.spinner}></span>
              Adding...
            </>
          ) : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={styles.container}>
        <SearchBar onSearch={handleSearch} />
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <div style={styles.loadingText}>Loading products...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <SearchBar onSearch={handleSearch} />
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>⚠️</div>
          <div style={styles.errorText}>{error}</div>
          <button 
            style={styles.retryButton} 
            onClick={() => fetchProducts()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <NotificationContainer />
      
      <div style={styles.header}>
        <h2 style={styles.title}>Our Products</h2>
        <p style={styles.subtitle}>Discover amazing products at great prices</p>
      </div>
      
      <SearchBar onSearch={handleSearch} />
      
      {searchTerm && (
        <div style={styles.searchInfo}>
          <span style={styles.searchIcon}>🔍</span>
          {products.length > 0 
            ? `Found ${products.length} product${products.length > 1 ? 's' : ''} for "${searchTerm}"`
            : `No products found for "${searchTerm}"`
          }
        </div>
      )}

      {products.length === 0 ? (
        <div style={styles.noProductsContainer}>
          <div style={styles.noProductsIcon}>📦</div>
          <div style={styles.noProductsText}>
            {searchTerm ? 'No products found matching your search.' : 'No products available'}
          </div>
          {searchTerm && (
            <button 
              style={styles.clearSearchButton}
              onClick={() => setSearchTerm('')}
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div style={styles.productGrid}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '0 2rem',
    maxWidth: '1400px',
    margin: '0 auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  notificationContainer: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  notification: {
    padding: '12px 16px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    minWidth: '300px',
    fontSize: '14px',
    fontWeight: '500',
    animation: 'slideIn 0.3s ease-out'
  },
  notificationSuccess: {
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb'
  },
  notificationError: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb'
  },
  notificationWarning: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    border: '1px solid #ffeaa7'
  },
  notificationInfo: {
    backgroundColor: '#d1ecf1',
    color: '#0c5460',
    border: '1px solid #bee5eb'
  },
  notificationIcon: {
    fontSize: '16px',
    fontWeight: 'bold'
  },
  header: {
    textAlign: 'center',
    marginBottom: '1.5rem', // Reduced from 3rem
    padding: '1.5rem 0' // Reduced from 2rem 0
  },
  title: {
    fontSize: '2rem', // Reduced from 2.5rem
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '0.5rem',
    letterSpacing: '-0.5px'
  },
  subtitle: {
    fontSize: '1rem', // Reduced from 1.1rem
    color: '#6c757d',
    margin: 0,
    fontWeight: '400'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 0',
    gap: '1rem'
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #007bff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    fontSize: '1.2rem',
    color: '#6c757d',
    fontWeight: '500'
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 0',
    gap: '1rem'
  },
  errorIcon: {
    fontSize: '3rem'
  },
  errorText: {
    fontSize: '1.2rem',
    color: '#dc3545',
    fontWeight: '500',
    textAlign: 'center'
  },
  retryButton: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0, 123, 255, 0.3)'
  },
  searchInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    margin: '2rem 0',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    color: '#495057',
    fontSize: '1rem',
    fontWeight: '500',
    border: '1px solid #e9ecef'
  },
  searchIcon: {
    fontSize: '1.2rem'
  },
  noProductsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 0',
    gap: '1.5rem'
  },
  noProductsIcon: {
    fontSize: '4rem',
    opacity: 0.5
  },
  noProductsText: {
    fontSize: '1.2rem',
    color: '#6c757d',
    fontWeight: '500',
    textAlign: 'center'
  },
  clearSearchButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '2rem',
    padding: '2rem 0'
  },
  productCard: {
    border: '1px solid #e9ecef',
    borderRadius: '16px',
    overflow: 'hidden',
    backgroundColor: 'white',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative'
  },
  imageContainer: {
    position: 'relative',
    height: '240px',
    overflow: 'hidden'
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    backgroundColor: '#f8f9fa',
    transition: 'transform 0.3s ease'
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6c757d',
    border: '2px dashed #dee2e6'
  },
  placeholderIcon: {
    fontSize: '3rem',
    marginBottom: '0.5rem',
    opacity: 0.4
  },
  placeholderText: {
    fontSize: '0.9rem',
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '500'
  },
  wishlistBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'rgba(255, 255, 255, 0.95)',
    border: 'none',
    borderRadius: '50%',
    width: '44px',
    height: '44px',
    cursor: 'pointer',
    fontSize: '1.4rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    backdropFilter: 'blur(10px)'
  },
  wishlistActive: {
    background: 'rgba(255, 255, 255, 0.95)',
    transform: 'scale(1.1)',
    boxShadow: '0 4px 12px rgba(255, 0, 0, 0.3)'
  },
  lowStockBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: '#ffc107',
    color: '#212529',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '600',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  outOfStockBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '600',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  productInfo: {
    padding: '1.5rem'
  },
  productName: {
    margin: '0 0 0.75rem 0',
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1a1a1a',
    lineHeight: '1.3'
  },
  productDescription: {
    margin: '0 0 1.25rem 0',
    color: '#6c757d',
    fontSize: '0.95rem',
    lineHeight: '1.5',
    height: '4.5em',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical'
  },
  productDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem'
  },
  productPrice: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#007bff',
    letterSpacing: '-0.5px'
  },
  productStock: {
    fontSize: '0.85rem',
    fontWeight: '500',
    padding: '4px 8px',
    borderRadius: '6px',
    backgroundColor: '#f8f9fa'
  },
  buyButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(40, 167, 69, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  disabledButton: {
    backgroundColor: '#6c757d',
    cursor: 'not-allowed',
    boxShadow: 'none'
  },
  loadingButton: {
    backgroundColor: '#17a2b8',
    cursor: 'not-allowed'
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }
};

// Add CSS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
  }
  
  .product-card:hover .product-image {
    transform: scale(1.05);
  }
  
  .buy-button:hover:not(:disabled) {
    background-color: #218838 !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(40, 167, 69, 0.4) !important;
  }
  
  .wishlist-btn:hover {
    transform: scale(1.1) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
  }
  
  .retry-button:hover {
    background-color: #0056b3 !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 123, 255, 0.4) !important;
  }
  
  .clear-search-button:hover {
    background-color: #5a6268 !important;
    transform: translateY(-1px);
  }
`;

if (!document.head.querySelector('style[data-product-list]')) {
  styleSheet.setAttribute('data-product-list', 'true');
  document.head.appendChild(styleSheet);
}

export default ProductList;