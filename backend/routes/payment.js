const express = require('express');
const bcrypt = require('bcryptjs');
const { Bank, Order, OrderItem, Product, Cart, CartItem } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Get payment methods
router.get('/methods', (req, res) => {
  res.json({
    methods: [
      {
        id: 'card',
        name: 'Debit/Credit Card',
        description: 'Pay using your bank card',
        icon: '💳',
        processingFee: 0,
        estimatedDelivery: '3-4 days'
      },
      {
        id: 'upi',
        name: 'UPI Payment',
        description: 'Pay using UPI (Google Pay, PhonePe, Paytm)',
        icon: '📱',
        processingFee: 0,
        estimatedDelivery: '3-4 days'
      },
      {
        id: 'cod',
        name: 'Cash on Delivery',
        description: 'Pay when your order is delivered',
        icon: '💵',
        processingFee: 40,
        estimatedDelivery: '5-7 days'
      }
    ]
  });
});

// Validate card payment
router.post('/validate-card', auth, async (req, res) => {
  try {
    const { accountNumber, pin } = req.body;

    if (!accountNumber || !pin) {
      return res.status(400).json({ message: 'Account number and PIN are required' });
    }

    // Find bank account
    const bankAccount = await Bank.findOne({ 
      where: { accountNumber, isActive: true } 
    });

    if (!bankAccount) {
      return res.status(404).json({ message: 'Invalid account number' });
    }

    // Verify PIN
    const isValidPin = await bcrypt.compare(pin.toString(), bankAccount.password);
    if (!isValidPin) {
      return res.status(401).json({ message: 'Invalid PIN' });
    }

    res.json({
      message: 'Card validated successfully',
      accountHolder: bankAccount.accountHolderName,
      bankName: bankAccount.bankName,
      balance: bankAccount.balance,
      maskedAccount: accountNumber.slice(0, 4) + '****' + accountNumber.slice(-4)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Validate UPI payment
router.post('/validate-upi', auth, async (req, res) => {
  try {
    const { upiId, pin } = req.body;

    if (!upiId || !pin) {
      return res.status(400).json({ message: 'UPI ID and PIN are required' });
    }

    // Find bank account by UPI ID
    const bankAccount = await Bank.findOne({ 
      where: { upiId, isActive: true } 
    });

    if (!bankAccount) {
      return res.status(404).json({ message: 'Invalid UPI ID' });
    }

    // Verify PIN
    const isValidPin = await bcrypt.compare(pin.toString(), bankAccount.password);
    if (!isValidPin) {
      return res.status(401).json({ message: 'Invalid UPI PIN' });
    }

    res.json({
      message: 'UPI validated successfully',
      accountHolder: bankAccount.accountHolderName,
      bankName: bankAccount.bankName,
      balance: bankAccount.balance,
      upiId: upiId
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Process payment
router.post('/process/:orderId', auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentMethod, paymentDetails } = req.body;

    // Find order
    const order = await Order.findOne({
      where: { 
        id: orderId,
        userId: req.user.id,
        status: 'pending',
        paymentStatus: 'pending'
      },
      include: [{ model: OrderItem, include: [Product] }]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found or already processed' });
    }

    let paymentResult = { success: false };
    let transactionId = 'TXN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 8).toUpperCase();

    if (paymentMethod === 'cod') {
      // COD - No payment processing needed
      paymentResult = {
        success: true,
        message: 'COD order confirmed',
        transactionId
      };
    } else if (paymentMethod === 'card') {
      // Process card payment
      const { accountNumber, pin } = paymentDetails;
      
      const bankAccount = await Bank.findOne({ 
        where: { accountNumber, isActive: true } 
      });

      if (!bankAccount) {
        return res.status(404).json({ message: 'Invalid account' });
      }

      const isValidPin = await bcrypt.compare(pin.toString(), bankAccount.password);
      if (!isValidPin) {
        return res.status(401).json({ message: 'Invalid PIN' });
      }

      if (parseFloat(bankAccount.balance) < parseFloat(order.totalAmount)) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }

      // Deduct amount
      await Bank.update(
        { balance: parseFloat(bankAccount.balance) - parseFloat(order.totalAmount) },
        { where: { id: bankAccount.id } }
      );

      paymentResult = {
        success: true,
        message: 'Payment successful',
        transactionId,
        deductedFrom: bankAccount.accountHolderName,
        remainingBalance: parseFloat(bankAccount.balance) - parseFloat(order.totalAmount)
      };
    } else if (paymentMethod === 'upi') {
      // Process UPI payment
      const { upiId, pin } = paymentDetails;
      
      const bankAccount = await Bank.findOne({ 
        where: { upiId, isActive: true } 
      });

      if (!bankAccount) {
        return res.status(404).json({ message: 'Invalid UPI ID' });
      }

      const isValidPin = await bcrypt.compare(pin.toString(), bankAccount.password);
      if (!isValidPin) {
        return res.status(401).json({ message: 'Invalid UPI PIN' });
      }

      if (parseFloat(bankAccount.balance) < parseFloat(order.totalAmount)) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }

      // Deduct amount
      await Bank.update(
        { balance: parseFloat(bankAccount.balance) - parseFloat(order.totalAmount) },
        { where: { id: bankAccount.id } }
      );

      paymentResult = {
        success: true,
        message: 'UPI payment successful',
        transactionId,
        deductedFrom: bankAccount.accountHolderName,
        remainingBalance: parseFloat(bankAccount.balance) - parseFloat(order.totalAmount)
      };
    }

    if (paymentResult.success) {
      // Update order status
      const updateData = {
        paymentStatus: 'paid',
        status: 'confirmed',
        transactionId,
        paymentDetails: {
          method: paymentMethod,
          transactionId,
          processedAt: new Date(),
          ...(paymentMethod !== 'cod' && { deductedFrom: paymentResult.deductedFrom })
        }
      };

      // Set estimated delivery
      const deliveryDate = new Date();
      if (paymentMethod === 'cod') {
        deliveryDate.setDate(deliveryDate.getDate() + 5); // COD takes longer
      } else {
        deliveryDate.setDate(deliveryDate.getDate() + 3); // Prepaid delivery
      }
      updateData.estimatedDelivery = deliveryDate;

      await Order.update(updateData, { where: { id: order.id } });

      // Clear user's cart after successful payment
      const cart = await Cart.findOne({ where: { userId: req.user.id } });
      if (cart) {
        await CartItem.destroy({ where: { cartId: cart.id } });
        await Cart.update({ totalAmount: 0 }, { where: { id: cart.id } });
      }

      // Update product stock
      for (const orderItem of order.OrderItems) {
        await Product.update(
          { stock: orderItem.Product.stock - orderItem.quantity },
          { where: { id: orderItem.productId } }
        );
      }

      // Fetch updated order
      const updatedOrder = await Order.findByPk(order.id, {
        include: [{ model: OrderItem, include: [Product] }]
      });

      res.json({
        message: paymentResult.message,
        order: updatedOrder,
        payment: {
          transactionId,
          method: paymentMethod,
          amount: order.totalAmount,
          currency: 'INR',
          status: 'success',
          ...(paymentResult.remainingBalance !== undefined && {
            remainingBalance: paymentResult.remainingBalance
          })
        }
      });
    } else {
      // Payment failed
      await Order.update(
        { 
          paymentStatus: 'failed',
          paymentDetails: {
            method: paymentMethod,
            failedAt: new Date(),
            reason: 'Payment processing failed'
          }
        },
        { where: { id: order.id } }
      );

      res.status(400).json({ message: 'Payment failed' });
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;