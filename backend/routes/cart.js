const express = require('express');
const { Cart, CartItem, Product } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [{
        model: CartItem,
        include: [Product]
      }]
    });

    if (!cart) {
      cart = await Cart.create({ userId: req.user.id });
      cart.CartItems = [];
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Get or create cart
    let cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id });
    }

    // Check if item already exists in cart
    let cartItem = await CartItem.findOne({
      where: { cartId: cart.id, productId }
    });

    if (cartItem) {
      // Update quantity
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // Create new cart item
      cartItem = await CartItem.create({
        cartId: cart.id,
        productId,
        quantity,
        price: product.price
      });
    }

    // Update cart total
    await updateCartTotal(cart.id);

    res.json({ message: 'Item added to cart', cartItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update cart item quantity
router.put('/update/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cartItem = await CartItem.findOne({
      where: { id: itemId },
      include: [{
        model: Cart,
        where: { userId: req.user.id }
      }, {
        model: Product
      }]
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Check stock
    if (cartItem.Product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    // Update cart total
    await updateCartTotal(cartItem.Cart.id);

    res.json({ message: 'Cart updated', cartItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove item from cart
router.delete('/remove/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params;

    const cartItem = await CartItem.findOne({
      where: { id: itemId },
      include: [{
        model: Cart,
        where: { userId: req.user.id }
      }]
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    const cartId = cartItem.Cart.id;
    await cartItem.destroy();

    // Update cart total
    await updateCartTotal(cartId);

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Clear cart
router.delete('/clear', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    await CartItem.destroy({ where: { cartId: cart.id } });
    cart.totalAmount = 0;
    await cart.save();

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Helper function to update cart total
async function updateCartTotal(cartId) {
  const cartItems = await CartItem.findAll({ where: { cartId } });
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  await Cart.update({ totalAmount: total }, { where: { id: cartId } });
}

module.exports = router;