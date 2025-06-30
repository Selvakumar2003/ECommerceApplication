const express = require('express');
const { Wishlist, Product } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's wishlist
router.get('/', auth, async (req, res) => {
  try {
    const wishlistItems = await Wishlist.findAll({
      where: { userId: req.user.id },
      include: [Product],
      order: [['createdAt', 'DESC']]
    });

    res.json(wishlistItems);
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add product to wishlist
router.post('/add', auth, async (req, res) => {
  try {
    const { productId } = req.body;

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if already in wishlist
    const existingItem = await Wishlist.findOne({
      where: { userId: req.user.id, productId }
    });

    if (existingItem) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    // Add to wishlist
    const wishlistItem = await Wishlist.create({
      userId: req.user.id,
      productId
    });

    // Return with product details
    const wishlistWithProduct = await Wishlist.findByPk(wishlistItem.id, {
      include: [Product]
    });

    res.status(201).json({
      message: 'Product added to wishlist',
      wishlistItem: wishlistWithProduct
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove product from wishlist
router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;

    const deleted = await Wishlist.destroy({
      where: { 
        userId: req.user.id, 
        productId: productId 
      }
    });

    if (deleted === 0) {
      return res.status(404).json({ message: 'Product not found in wishlist' });
    }

    res.json({ message: 'Product removed from wishlist' });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Check if product is in wishlist
router.get('/check/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlistItem = await Wishlist.findOne({
      where: { userId: req.user.id, productId }
    });

    res.json({ inWishlist: !!wishlistItem });
  } catch (error) {
    console.error('Check wishlist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;