import React, { useState } from 'react';
import { orderAPI } from '../utils/api';

const Payment = ({ order, onPaymentSuccess, onClose }) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: '',
    billingAddress: ''
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCardNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiryDate = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Add slash after MM
    if (digits.length >= 2) {
      return digits.substring(0, 2) + '/' + digits.substring(2, 4);
    }
    return digits;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) { // 16 digits + 3 spaces
      setPaymentData(prev => ({
        ...prev,
        cardNumber: formatted
      }));
    }
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.length <= 5) { // MM/YY
      setPaymentData(prev => ({
        ...prev,
        expiryDate: formatted
      }));
    }
  };

  const validatePaymentData = () => {
    if (!paymentData.cardNumber.replace(/\s/g, '') || paymentData.cardNumber.replace(/\s/g, '').length < 16) {
      return 'Please enter a valid card number';
    }
    if (!paymentData.expiryDate || paymentData.expiryDate.length < 5) {
      return 'Please enter a valid expiry date';
    }
    if (!paymentData.cvv || paymentData.cvv.length < 3) {
      return 'Please enter a valid CVV';
    }
    if (!paymentData.cardHolder.trim()) {
      return 'Please enter cardholder name';
    }
    if (!paymentData.billingAddress.trim()) {
      return 'Please enter billing address';
    }
    return null;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    const validationError = validatePaymentData();
    if (validationError) {
      setError(validationError);
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const response = await orderAPI.pay(order.id, {
        ...paymentData,
        amount: order.totalAmount
      });

      if (response.data.message === 'Payment successful') {
        onPaymentSuccess(response.data);
      } else {
        setError('Payment failed. Please try again.');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2>Payment Details</h2>
          <button style={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div style={styles.content}>
          <div style={styles.orderSummary}>
            <h3>Order Summary</h3>
            <p><strong>Order #:</strong> {order.orderNumber}</p>
            <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
            <p><strong>Items:</strong> {order.OrderItems?.length || 0} item(s)</p>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handlePayment} style={styles.form}>
            <div style={styles.formGroup}>
              <label>Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={paymentData.cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label>Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={paymentData.expiryDate}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label>CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={paymentData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  maxLength="4"
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label>Cardholder Name</label>
              <input
                type="text"
                name="cardHolder"
                value={paymentData.cardHolder}
                onChange={handleInputChange}
                placeholder="John Doe"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label>Billing Address</label>
              <textarea
                name="billingAddress"
                value={paymentData.billingAddress}
                onChange={handleInputChange}
                placeholder="123 Main St, City, State, ZIP"
                style={styles.textarea}
                rows="3"
                required
              />
            </div>

            <div style={styles.actions}>
              <button
                type="button"
                style={styles.cancelBtn}
                onClick={onClose}
                disabled={processing}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={styles.payBtn}
                disabled={processing}
              >
                {processing ? 'Processing...' : `Pay $${order.totalAmount}`}
              </button>
            </div>
          </form>
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
    maxWidth: '500px',
    maxHeight: '90%',
    overflow: 'auto'
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
    padding: '1.5rem'
  },
  orderSummary: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1.5rem'
  },
  error: {
    color: 'red',
    marginBottom: '1rem',
    padding: '0.5rem',
    backgroundColor: '#ffebee',
    borderRadius: '4px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  formRow: {
    display: 'flex',
    gap: '1rem'
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem'
  },
  textarea: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    resize: 'vertical'
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    marginTop: '1rem'
  },
  cancelBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  payBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold'
  }
};

export default Payment;