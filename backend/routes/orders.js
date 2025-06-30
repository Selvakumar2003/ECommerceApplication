const express = require('express');
const { Order, OrderItem, Cart, CartItem, Product } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{
        model: OrderItem,
        include: [Product]
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      },
      include: [{
        model: OrderItem,
        include: [Product]
      }]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get single order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create order from cart (simplified version)
router.post('/create', auth, async (req, res) => {
  try {
    console.log('=== ORDER CREATION START ===');
    console.log('User ID:', req.user.id);
    console.log('Request body:', req.body);

    const { shippingAddress, paymentMethod } = req.body;

    // Validate payment method
    if (!['card', 'upi', 'cod'].includes(paymentMethod)) {
      console.log('Invalid payment method:', paymentMethod);
      return res.status(400).json({ message: 'Invalid payment method. Must be card, upi, or cod.' });
    }

    // Get user's cart
    console.log('Fetching cart for user:', req.user.id);
    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [{
        model: CartItem,
        include: [Product]
      }]
    });

    console.log('Cart found:', !!cart);
    if (cart) {
      console.log('Cart total:', cart.totalAmount);
      console.log('Cart items count:', cart.CartItems?.length || 0);
    }

    if (!cart || !cart.CartItems || cart.CartItems.length === 0) {
      console.log('Cart is empty');
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Check stock for all items
    console.log('Checking stock for all items...');
    for (const item of cart.CartItems) {
      console.log(`Item: ${item.Product?.name}, Stock: ${item.Product?.stock}, Requested: ${item.quantity}`);
      if (!item.Product) {
        console.error('Product not found for cart item:', item.id);
        return res.status(400).json({ message: 'Product not found in cart' });
      }
      if (item.Product.stock < item.quantity) {
        console.log('Insufficient stock for:', item.Product.name);
        return res.status(400).json({ 
          message: `Insufficient stock for ${item.Product.name}. Available: ${item.Product.stock}, Requested: ${item.quantity}` 
        });
      }
    }

    // Calculate total with COD charges
    let totalAmount = parseFloat(cart.totalAmount || 0);
    if (paymentMethod === 'cod') {
      totalAmount += 40; // COD charges ₹40
    }

    console.log('Total amount calculated:', totalAmount);

    // Generate order number
    const orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
    console.log('Generated order number:', orderNumber);

    // Create order with minimal data
    const orderData = {
      userId: req.user.id,
      orderNumber,
      totalAmount,
      shippingAddress: shippingAddress || 'No address provided',
      paymentMethod,
      status: 'pending',
      paymentStatus: 'pending'
    };

    console.log('Creating order with data:', orderData);

    const order = await Order.create(orderData);
    console.log('Order created successfully with ID:', order.id);

    // Create order items
    console.log('Creating order items...');
    for (const cartItem of cart.CartItems) {
      const orderItemData = {
        orderId: order.id,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        price: cartItem.price,
        productName: cartItem.Product.name
      };
      
      console.log('Creating order item:', orderItemData);
      await OrderItem.create(orderItemData);
    }

    // Fetch complete order data
    console.log('Fetching complete order data...');
    const completeOrder = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        include: [Product]
      }]
    });

    console.log('=== ORDER CREATION SUCCESS ===');
    console.log('Complete order:', completeOrder.toJSON());

    res.status(201).json({
      message: 'Order created successfully. Proceed to payment.',
      order: completeOrder
    });

  } catch (error) {
    console.error('=== ORDER CREATION ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ 
      message: 'Server error during order creation', 
      error: error.message,
      details: error.stack
    });
  }
});

module.exports = router; auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      },
      include: [{
        model: OrderItem,
        include: [Product]
      }]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create order from cart
router.post('/create', auth, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod = 'credit_card' } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [{
        model: CartItem,
        include: [Product]
      }]
    });

    if (!cart || cart.CartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Check stock for all items
    for (const item of cart.CartItems) {
      if (item.Product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${item.Product.name}` 
        });
      }
    }

    // Generate order number
    const orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();

    // Create order
    const order = await Order.create({
      userId: req.user.id,
      orderNumber,
      totalAmount: cart.totalAmount,
      shippingAddress,
      paymentMethod,
      status: 'pending',
      paymentStatus: 'pending'
    });

    // Create order items and update product stock
    for (const cartItem of cart.CartItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        price: cartItem.price,
        productName: cartItem.Product.name
      });

      // Update product stock
      await Product.update(
        { stock: cartItem.Product.stock - cartItem.quantity },
        { where: { id: cartItem.productId } }
      );
    }

    // Clear cart
    await CartItem.destroy({ where: { cartId: cart.id } });
    await Cart.update({ totalAmount: 0 }, { where: { id: cart.id } });

    // Fetch complete order data
    const completeOrder = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        include: [Product]
      }]
    });

    res.status(201).json({
      message: 'Order created successfully',
      order: completeOrder
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Process payment
router.post('/:id/pay', auth, async (req, res) => {
  try {
    const { paymentDetails } = req.body;

    const order = await Order.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Order already paid' });
    }

    // Simulate payment processing
    // In a real application, you would integrate with a payment gateway
    const paymentSuccess = Math.random() > 0.1; // 90% success rate for demo

    if (paymentSuccess) {
      order.paymentStatus = 'paid';
      order.status = 'processing';
      await order.save();

      res.json({
        message: 'Payment successful',
        order,
        paymentId: 'PAY-' + Date.now()
      });
    } else {
      order.paymentStatus = 'failed';
      await order.save();

      res.status(400).json({
        message: 'Payment failed',
        error: 'Payment processing failed'
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;