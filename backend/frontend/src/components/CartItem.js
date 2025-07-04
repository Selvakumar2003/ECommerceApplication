import React, { useState } from 'react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const [updating, setUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdating(true);
    try {
      await onUpdateQuantity(item.id, newQuantity);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    setUpdating(true);
    try {
      await onRemove(item.id);
    } finally {
      setUpdating(false);
    }
  };

  const subtotal = (item.price * item.quantity).toFixed(2);

  return (
    <div style={styles.cartItem}>
      <div style={styles.productInfo}>
        <img 
          src={item.Product?.image || 'https://via.placeholder.com/80x80'} 
          alt={item.Product?.name || 'Product'} 
          style={styles.productImage}
        />
        <div style={styles.productDetails}>
          <h4 style={styles.productName}>{item.Product?.name}</h4>
          <p style={styles.productPrice}>₹{item.price} each</p>
          <p style={styles.stockInfo}>
            Available: {item.Product?.stock || 0}
          </p>
        </div>
      </div>

      <div style={styles.quantityControls}>
        <button
          style={styles.quantityBtn}
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={updating || item.quantity <= 1}
        >
          -
        </button>
        <span style={styles.quantity}>{item.quantity}</span>
        <button
          style={styles.quantityBtn}
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={updating || item.quantity >= (item.Product?.stock || 0)}
        >
          +
        </button>
      </div>

      <div style={styles.subtotal}>
        <strong>₹{subtotal}</strong>
      </div>

      <button
        style={styles.removeBtn}
        onClick={handleRemove}
        disabled={updating}
      >
        {updating ? '...' : '🗑️'}
      </button>
    </div>
  );
};

const styles = {
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem',
    border: '1px solid #eee',
    borderRadius: '8px',
    marginBottom: '1rem',
    backgroundColor: 'white'
  },
  productInfo: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    gap: '1rem'
  },
  productImage: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '4px'
  },
  productDetails: {
    flex: 1
  },
  productName: {
    margin: '0 0 0.5rem 0',
    fontSize: '1rem',
    color: '#333'
  },
  productPrice: {
    margin: '0 0 0.25rem 0',
    color: '#666',
    fontSize: '0.9rem'
  },
  stockInfo: {
    margin: 0,
    fontSize: '0.8rem',
    color: '#999'
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    margin: '0 1rem'
  },
  quantityBtn: {
    width: '32px',
    height: '32px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  quantity: {
    minWidth: '40px',
    textAlign: 'center',
    fontSize: '1rem',
    fontWeight: 'bold'
  },
  subtotal: {
    minWidth: '80px',
    textAlign: 'right',
    fontSize: '1.1rem',
    color: '#007bff'
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2rem',
    padding: '0.5rem',
    color: '#dc3545',
    marginLeft: '1rem'
  }
};

export default CartItem;