import React, { useState, useEffect } from 'react';
import { orderAPI, paymentAPI } from '../utils/api';

const CheckoutPage = ({ cart, onClose, onOrderComplete }) => {
  const [step, setStep] = useState('shipping'); // shipping, payment, confirmation
  const [shippingData, setShippingData] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });
  const [order, setOrder] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [paymentResult, setPaymentResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await paymentAPI.getMethods();
      setPaymentMethods(response.data.methods);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateShippingData = () => {
    const required = ['fullName', 'address', 'city', 'state', 'zipCode', 'phone'];
    for (const field of required) {
      if (!shippingData[field].trim()) {
        return `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`;
      }
    }
    return null;
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    
    const validationError = validateShippingData();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!selectedPaymentMethod) {
      setError('Please select a payment method');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const shippingAddress = `${shippingData.fullName}\n${shippingData.address}\n${shippingData.city}, ${shippingData.state} ${shippingData.zipCode}\nPhone: ${shippingData.phone}`;
      
      const response = await orderAPI.create({
        shippingAddress,
        paymentMethod: selectedPaymentMethod
      });

      setOrder(response.data.order);
      setStep('payment');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentData) => {
    setPaymentResult(paymentData);
    setStep('confirmation');
    onOrderComplete();
  };

  const getOrderTotal = () => {
    if (!cart) return 0;
    let total = parseFloat(cart.totalAmount);
    if (selectedPaymentMethod === 'cod') {
      total += 40; // COD charges
    }
    return total.toFixed(2);
  };

  const renderShippingForm = () => (
    <div>
      <h3>Shipping Information</h3>
      
      {error && <div style={styles.error}>{error}</div>}
      
      <form onSubmit={handleCreateOrder} style={styles.form}>
        <div style={styles.formGroup}>
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={shippingData.fullName}
            onChange={handleShippingChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={shippingData.address}
            onChange={handleShippingChange}
            placeholder="Street address"
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label>City</label>
            <input
              type="text"
              name="city"
              value={shippingData.city}
              onChange={handleShippingChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label>State</label>
            <input
              type="text"
              name="state"
              value={shippingData.state}
              onChange={handleShippingChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label>ZIP Code</label>
            <input
              type="text"
              name="zipCode"
              value={shippingData.zipCode}
              onChange={handleShippingChange}
              style={styles.input}
              required
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={shippingData.phone}
            onChange={handleShippingChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label>Payment Method</label>
          <div style={styles.paymentMethods}>
            {paymentMethods.map(method => (
              <div
                key={method.id}
                style={{
                  ...styles.paymentOption,
                  ...(selectedPaymentMethod === method.id ? styles.selectedPayment : {})
                }}
                onClick={() => setSelectedPaymentMethod(method.id)}
              >
                <div style={styles.paymentHeader}>
                  <span style={styles.paymentIcon}>{method.icon}</span>
                  <div>
                    <div style={styles.paymentName}>{method.name}</div>
                    <div style={styles.paymentDesc}>{method.description}</div>
                  </div>
                </div>
                <div style={styles.paymentDetails}>
                  <div>Delivery: {method.estimatedDelivery}</div>
                  {method.processingFee > 0 && (
                    <div>Fee: ₹{method.processingFee}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.actions}>
          <button
            type="button"
            style={styles.cancelBtn}
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={styles.continueBtn}
            disabled={loading}
          >
            {loading ? 'Creating Order...' : 'Continue to Payment'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderOrderSummary = () => (
    <div style={styles.orderSummary}>
      <h3>Order Summary</h3>
      <div style={styles.cartItems}>
        {cart?.CartItems?.map(item => (
          <div key={item.id} style={styles.summaryItem}>
            <span>{item.Product?.name} (x{item.quantity})</span>
            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div style={styles.charges}>
        <div style={styles.summaryItem}>
          <span>Subtotal</span>
          <span>₹{cart?.totalAmount}</span>
        </div>
        {selectedPaymentMethod === 'cod' && (
          <div style={styles.summaryItem}>
            <span>COD Charges</span>
            <span>₹40.00</span>
          </div>
        )}
      </div>
      <div style={styles.total}>
        <strong>Total: ₹{getOrderTotal()}</strong>
      </div>
    </div>
  );

  if (step === 'payment' && order) {
    return <PaymentComponent order={order} onPaymentSuccess={handlePaymentSuccess} onClose={onClose} />;
  }

  if (step === 'confirmation' && order && paymentResult) {
    return <OrderConfirmationComponent order={paymentResult.order} paymentData={paymentResult} onClose={onClose} />;
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2>Checkout</h2>
          <button style={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div style={styles.content}>
          <div style={styles.steps}>
            <div style={{...styles.step, ...(step === 'shipping' ? styles.activeStep : {})}}>
              1. Shipping & Payment
            </div>
            <div style={{...styles.step, ...(step === 'payment' ? styles.activeStep : {})}}>
              2. Pay Now
            </div>
            <div style={{...styles.step, ...(step === 'confirmation' ? styles.activeStep : {})}}>
              3. Confirmation
            </div>
          </div>

          <div style={styles.checkoutContent}>
            <div style={styles.mainContent}>
              {renderShippingForm()}
            </div>
            <div style={styles.sidebar}>
              {renderOrderSummary()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Payment Component
const PaymentComponent = ({ order, onPaymentSuccess, onClose }) => {
  const [paymentData, setPaymentData] = useState({
    cardData: { accountNumber: '', pin: '' },
    upiData: { upiId: '', pin: '' }
  });
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [validated, setValidated] = useState(false);

  const handleInputChange = (type, field, value) => {
    setPaymentData(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: value }
    }));
    setValidated(false);
  };

  const validatePayment = async () => {
    setProcessing(true);
    setPaymentError('');

    try {
      if (order.paymentMethod === 'card') {
        const { accountNumber, pin } = paymentData.cardData;
        if (!accountNumber || !pin) {
          setPaymentError('Please enter account number and PIN');
          return;
        }
        await paymentAPI.validateCard(accountNumber, pin);
      } else if (order.paymentMethod === 'upi') {
        const { upiId, pin } = paymentData.upiData;
        if (!upiId || !pin) {
          setPaymentError('Please enter UPI ID and PIN');
          return;
        }
        await paymentAPI.validateUPI(upiId, pin);
      }
      setValidated(true);
    } catch (error) {
      setPaymentError(error.response?.data?.message || 'Validation failed');
    } finally {
      setProcessing(false);
    }
  };

  const processPayment = async () => {
    setProcessing(true);
    setPaymentError('');

    try {
      let paymentDetails = {};
      
      if (order.paymentMethod === 'card') {
        paymentDetails = paymentData.cardData;
      } else if (order.paymentMethod === 'upi') {
        paymentDetails = paymentData.upiData;
      }

      const response = await paymentAPI.processPayment(
        order.id,
        order.paymentMethod,
        paymentDetails
      );

      onPaymentSuccess(response.data);
    } catch (error) {
      setPaymentError(error.response?.data?.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  const renderPaymentForm = () => {
    if (order.paymentMethod === 'cod') {
      return (
        <div style={styles.codMessage}>
          <h4>🚚 Cash on Delivery</h4>
          <p>You will pay ₹{order.totalAmount} when your order is delivered.</p>
          <p>COD charges: ₹40 (included in total)</p>
          <p>Estimated delivery: 5-7 business days</p>
        </div>
      );
    }

    if (order.paymentMethod === 'card') {
      return (
        <div>
          <h4>💳 Card Payment</h4>
          {/* <div style={styles.testInfo}>
            <strong>Test Accounts:</strong>
            <div>Account: 1234567890123456 | PIN: 1234 | Balance: ₹1,50,000</div>
            <div>Account: 2345678901234567 | PIN: 5678 | Balance: ₹75,000</div>
          </div> */}
          <div style={styles.formGroup}>
            <label>Account Number</label>
            <input
              type="text"
              value={paymentData.cardData.accountNumber}
              onChange={(e) => handleInputChange('cardData', 'accountNumber', e.target.value)}
              placeholder="1234567890123456"
              style={styles.input}
              maxLength="16"
            />
          </div>
          <div style={styles.formGroup}>
            <label>PIN</label>
            <input
              type="password"
              value={paymentData.cardData.pin}
              onChange={(e) => handleInputChange('cardData', 'pin', e.target.value)}
              placeholder="1234"
              style={styles.input}
              maxLength="4"
            />
          </div>
        </div>
      );
    }

    if (order.paymentMethod === 'upi') {
      return (
        <div>
          <h4>📱 UPI Payment</h4>
          {/* <div style={styles.testInfo}>
            <strong>Test UPI IDs:</strong>
            <div>UPI: rajesh@paytm | PIN: 1234 | Balance: ₹1,50,000</div>
            <div>UPI: priya@googlepay | PIN: 5678 | Balance: ₹75,000</div>
          </div> */}
          <div style={styles.formGroup}>
            <label>UPI ID</label>
            <input
              type="text"
              value={paymentData.upiData.upiId}
              onChange={(e) => handleInputChange('upiData', 'upiId', e.target.value)}
              placeholder="yourname@paytm"
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label>UPI PIN</label>
            <input
              type="password"
              value={paymentData.upiData.pin}
              onChange={(e) => handleInputChange('upiData', 'pin', e.target.value)}
              placeholder="1234"
              style={styles.input}
              maxLength="4"
            />
          </div>
        </div>
      );
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2>Payment</h2>
          <button style={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div style={styles.content}>
          <div style={styles.steps}>
            <div style={styles.step}>1. Shipping & Payment</div>
            <div style={{...styles.step, ...styles.activeStep}}>2. Pay Now</div>
            <div style={styles.step}>3. Confirmation</div>
          </div>

          <div style={styles.mainContent}>
            <h3>Payment Details</h3>
            <div style={styles.orderSummary}>
              <p><strong>Order #:</strong> {order.orderNumber}</p>
              <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
              <p><strong>Payment Method:</strong> {order.paymentMethod.toUpperCase()}</p>
            </div>

            {paymentError && <div style={styles.error}>{paymentError}</div>}

            {renderPaymentForm()}

            <div style={styles.actions}>
              <button
                type="button"
                style={styles.cancelBtn}
                onClick={onClose}
                disabled={processing}
              >
                Cancel
              </button>
              
              {order.paymentMethod === 'cod' ? (
                <button
                  style={styles.payBtn}
                  onClick={processPayment}
                  disabled={processing}
                >
                  {processing ? 'Confirming...' : 'Confirm COD Order'}
                </button>
              ) : !validated ? (
                <button
                  style={styles.validateBtn}
                  onClick={validatePayment}
                  disabled={processing}
                >
                  {processing ? 'Validating...' : 'Validate Payment Details'}
                </button>
              ) : (
                <button
                  style={styles.payBtn}
                  onClick={processPayment}
                  disabled={processing}
                >
                  {processing ? 'Processing...' : `Pay ₹${order.totalAmount}`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Order Confirmation Component
const OrderConfirmationComponent = ({ order, paymentData, onClose }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentMethodDisplay = (method) => {
    const methods = {
      'card': '💳 Card Payment',
      'upi': '📱 UPI Payment',
      'cod': '💵 Cash on Delivery'
    };
    return methods[method] || method;
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2>Order Confirmation</h2>
          <button style={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div style={styles.content}>
          <div style={styles.steps}>
            <div style={styles.step}>1. Shipping & Payment</div>
            <div style={styles.step}>2. Pay Now</div>
            <div style={{...styles.step, ...styles.activeStep}}>3. Confirmation</div>
          </div>

          <div style={styles.confirmationContent}>
            <div style={styles.successIcon}>✅</div>
            
            <h2 style={styles.title}>
              {order.paymentMethod === 'cod' ? 'Order Placed Successfully!' : 'Payment Successful!'}
            </h2>
            <p style={styles.subtitle}>Thank you for your order</p>

            <div style={styles.orderDetails}>
              <div style={styles.detailRow}>
                <strong>Order Number:</strong>
                <span>{order.orderNumber}</span>
              </div>
              {paymentData?.payment?.transactionId && (
                <div style={styles.detailRow}>
                  <strong>Transaction ID:</strong>
                  <span>{paymentData.payment.transactionId}</span>
                </div>
              )}
              <div style={styles.detailRow}>
                <strong>Amount:</strong>
                <span>₹{order.totalAmount}</span>
              </div>
              <div style={styles.detailRow}>
                <strong>Payment Method:</strong>
                <span>{getPaymentMethodDisplay(order.paymentMethod)}</span>
              </div>
              <div style={styles.detailRow}>
                <strong>Status:</strong>
                <span style={styles.paidStatus}>
                  {order.paymentMethod === 'cod' ? 'COD CONFIRMED' : 'PAID'}
                </span>
              </div>
              <div style={styles.detailRow}>
                <strong>Order Date:</strong>
                <span>{formatDate(order.createdAt)}</span>
              </div>
              {order.estimatedDelivery && (
                <div style={styles.detailRow}>
                  <strong>Estimated Delivery:</strong>
                  <span>{formatDate(order.estimatedDelivery)}</span>
                </div>
              )}
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
                <li>
                  Expected delivery: {order.paymentMethod === 'cod' ? '5-7 business days' : '3-4 business days'}
                </li>
                {order.paymentMethod === 'cod' && (
                  <li>Please keep ₹{order.totalAmount} ready for cash payment on delivery</li>
                )}
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
    maxWidth: '1000px',
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
  steps: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2rem',
    gap: '2rem'
  },
  step: {
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    backgroundColor: '#f8f9fa',
    color: '#666'
  },
  activeStep: {
    backgroundColor: '#007bff',
    color: 'white'
  },
  checkoutContent: {
    display: 'flex',
    gap: '2rem'
  },
  mainContent: {
    flex: 2
  },
  sidebar: {
    flex: 1
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
  paymentMethods: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  paymentOption: {
    border: '2px solid #ddd',
    borderRadius: '8px',
    padding: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  selectedPayment: {
    borderColor: '#007bff',
    backgroundColor: '#f0f8ff'
  },
  paymentHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '0.5rem'
  },
  paymentIcon: {
    fontSize: '2rem'
  },
  paymentName: {
    fontWeight: 'bold',
    fontSize: '1.1rem'
  },
  paymentDesc: {
    color: '#666',
    fontSize: '0.9rem'
  },
  paymentDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    color: '#666'
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
  continueBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  validateBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#ffc107',
    color: 'black',
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
  },
  orderSummary: {
    backgroundColor: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '8px'
  },
  cartItems: {
    marginBottom: '1rem'
  },
  charges: {
    borderTop: '1px solid #ddd',
    paddingTop: '1rem',
    marginBottom: '1rem'
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #eee'
  },
  total: {
    fontSize: '1.2rem',
    textAlign: 'right',
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '2px solid #007bff'
  },
  testInfo: {
    backgroundColor: '#e7f3ff',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    fontSize: '0.9rem',
    border: '1px solid #b3d9ff'
  },
  codMessage: {
    backgroundColor: '#f8f9fa',
    padding: '2rem',
    borderRadius: '8px',
    textAlign: 'center',
    border: '2px solid #28a745'
  },
  confirmationContent: {
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
  }
};

export default CheckoutPage;