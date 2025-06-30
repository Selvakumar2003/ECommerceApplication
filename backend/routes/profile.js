const express = require('express');
const bcrypt = require('bcryptjs');
const { User, Order, OrderItem, Product, Wishlist } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'createdAt']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get order count
    const orderCount = await Order.count({ where: { userId: req.user.id } });
    
    // Get wishlist count
    const wishlistCount = await Wishlist.count({ where: { userId: req.user.id } });

    res.json({
      user,
      stats: {
        totalOrders: orderCount,
        wishlistItems: wishlistCount,
        memberSince: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put('/', auth, async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if email is already taken by another user
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ 
        where: { email },
        attributes: ['id']
      });
      
      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Update user
    await User.update(
      { name, email },
      { where: { id: req.user.id } }
    );

    // Get updated user
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'createdAt']
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Change password
router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    // Get user with password
    const user = await User.findByPk(req.user.id);
    
    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await User.update(
      { password: hashedPassword },
      { where: { id: req.user.id } }
    );

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's order history with pagination
router.get('/orders', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = { userId: req.user.id };
    if (status) {
      whereClause.status = status;
    }

    const orders = await Order.findAndCountAll({
      where: whereClause,
      include: [{
        model: OrderItem,
        include: [Product]
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      orders: orders.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(orders.count / limit),
        totalOrders: orders.count,
        hasNext: offset + orders.rows.length < orders.count,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get order history error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's wishlist
router.get('/wishlist', auth, async (req, res) => {
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

module.exports = router;