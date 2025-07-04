import React, { useState, useEffect } from 'react';
import { cartAPI } from '../utils/api';
import CartItem from './CartItem';

const Cart = ({ onClose, onCheckout }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.get();
      setCart(response.data);
    } catch (error) {
      setError('Failed to fetch cart');
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
    try {
      await cartAPI.update(itemId, quantity);
      await fetchCart(); // Refresh cart
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update item');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await cartAPI.remove(itemId);
      await fetchCart(); // Refresh cart
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    try {
      await cartAPI.clear();
      await fetchCart(); // Refresh cart
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to clear cart');
    }
  };

  const getTotalItems = () => {
    if (!cart?.CartItems) return 0;
    return cart.CartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <div style={styles.header}>
            <h2>Shopping Cart</h2>
            <button style={styles.closeBtn} onClick={onClose}>×</button>
          </div>
          <div style={styles.loading}>Loading cart...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <div style={styles.header}>
            <h2>Shopping Cart</h2>
            <button style={styles.closeBtn} onClick={onClose}>×</button>
          </div>
          <div style={styles.error}>{error}</div>
        </div>
      </div>
    );
  }

  const cartItems = cart?.CartItems || [];
  const totalAmount = cart?.totalAmount || 0;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2>Shopping Cart ({getTotalItems()} items)</h2>
          <button style={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div style={styles.content}>
          {cartItems.length === 0 ? (
            <div style={styles.emptyCart}>
              <p>Your cart is empty</p>
              <button style={styles.continueBtn} onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div style={styles.cartItems}>
                {cartItems.map(item => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>

              <div style={styles.cartSummary}>
                <div style={styles.total}>
                  <strong>Total: ₹{totalAmount}</strong>
                </div>
                
                <div style={styles.actions}>
                  <button style={styles.clearBtn} onClick={handleClearCart}>
                    Clear Cart
                  </button>
                  <button style={styles.continueBtn} onClick={onClose}>
                    Continue Shopping
                  </button>
                  <button 
                    style={styles.checkoutBtn} 
                    onClick={() => onCheckout(cart)}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '90%',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid #eee'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer'
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  loading: {
    padding: '2rem',
    textAlign: 'center'
  },
  error: {
    padding: '2rem',
    textAlign: 'center',
    color: 'red'
  },
  emptyCart: {
    padding: '3rem',
    textAlign: 'center'
  },
  cartItems: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem'
  },
  cartSummary: {
    padding: '1.5rem',
    borderTop: '1px solid #eee',
    backgroundColor: '#f8f9fa'
  },
  total: {
    fontSize: '1.2rem',
    marginBottom: '1rem',
    textAlign: 'right'
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end'
  },
  clearBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  continueBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  checkoutBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem'
  }
};

export default Cart;