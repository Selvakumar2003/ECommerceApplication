import React from 'react';

const OrderConfirmation = ({ order, paymentData, onClose }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.content}>
          <div style={styles.successIcon}>✅</div>
          
          <h2 style={styles.title}>Payment Successful!</h2>
          <p style={styles.subtitle}>Thank you for your order</p>

          <div style={styles.orderDetails}>
            <div style={styles.detailRow}>
              <strong>Order Number:</strong>
              <span>{order.orderNumber}</span>
            </div>
            <div style={styles.detailRow}>
              <strong>Payment ID:</strong>
              <span>{paymentData.paymentId}</span>
            </div>
            <div style={styles.detailRow}>
              <strong>Amount Paid:</strong>
              <span>${order.totalAmount}</span>
            </div>
            <div style={styles.detailRow}>
              <strong>Payment Status:</strong>
              <span style={styles.paidStatus}>PAID</span>
            </div>
            <div style={styles.detailRow}>
              <strong>Order Date:</strong>
              <span>{formatDate(order.createdAt)}</span>
            </div>
          </div>

          {order.OrderItems && order.OrderItems.length > 0 && (
            <div style={styles.itemsSection}>
              <h3>Order Items</h3>
              <div style={styles.orderItems}>
                {order.OrderItems.map((item, index) => (
                  <div key={index} style={styles.orderItem}>
                    <div style={styles.itemInfo}>
                      <span style={styles.itemName}>{item.productName}</span>
                      <span style={styles.itemQuantity}>Qty: {item.quantity}</span>
                    </div>
                    <span style={styles.itemPrice}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={styles.nextSteps}>
            <h3>What's Next?</h3>
            <ul style={styles.stepsList}>
              <li>You will receive an order confirmation email shortly</li>
              <li>Your order will be processed within 1-2 business days</li>
              <li>You'll receive tracking information once your order ships</li>
              <li>Expected delivery: 3-5 business days</li>
            </ul>
          </div>

          <div style={styles.actions}>
            <button style={styles.continueBtn} onClick={onClose}>
              Continue Shopping
            </button>
          </div>
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
    maxWidth: '600px',
    maxHeight: '90%',
    overflow: 'auto'
  },
  content: {
    padding: '2rem',
    textAlign: 'center'
  },
  successIcon: {
    fontSize: '4rem',
    marginBottom: '1rem'
  },
  title: {
    color: '#28a745',
    marginBottom: '0.5rem'
  },
  subtitle: {
    color: '#666',
    marginBottom: '2rem',
    fontSize: '1.1rem'
  },
  orderDetails: {
    backgroundColor: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    textAlign: 'left'
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.75rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid #eee'
  },
  paidStatus: {
    color: '#28a745',
    fontWeight: 'bold'
  },
  itemsSection: {
    marginBottom: '2rem',
    textAlign: 'left'
  },
  orderItems: {
    border: '1px solid #eee',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    borderBottom: '1px solid #eee'
  },
  itemInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  itemName: {
    fontWeight: 'bold'
  },
  itemQuantity: {
    fontSize: '0.9rem',
    color: '#666'
  },
  itemPrice: {
    fontWeight: 'bold',
    color: '#007bff'
  },
  nextSteps: {
    textAlign: 'left',
    marginBottom: '2rem'
  },
  stepsList: {
    paddingLeft: '1.5rem',
    lineHeight: 1.6
  },
  actions: {
    textAlign: 'center'
  },
  continueBtn: {
    padding: '1rem 2rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: 'bold'
  }
};

export default OrderConfirmation;