const express = require('express');
const { Product } = require('../models');
const { Op } = require('sequelize');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all products with advanced search and filtering
router.get('/', async (req, res) => {
  try {
    const { 
      search, 
      category, 
      minPrice, 
      maxPrice, 
      sortBy, 
      page = 1, 
      limit = 100 
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Build where clause for filtering
    let whereClause = {};
    
    // Text search
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // Category filter
    if (category && category !== '') {
      whereClause.category = category;
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice && minPrice !== '0') {
        whereClause.price[Op.gte] = parseFloat(minPrice);
      }
      if (maxPrice && maxPrice !== '0') {
        whereClause.price[Op.lte] = parseFloat(maxPrice);
      }
    }
    
    // Build order clause for sorting
    let orderClause = [['createdAt', 'DESC']]; // default sorting
    
    switch (sortBy) {
      case 'price-low':
        orderClause = [['price', 'ASC']];
        break;
      case 'price-high':
        orderClause = [['price', 'DESC']];
        break;
      case 'name-asc':
        orderClause = [['name', 'ASC']];
        break;
      case 'name-desc':
        orderClause = [['name', 'DESC']];
        break;
      case 'rating':
        // Assuming you have a rating field, fallback to createdAt if not
        orderClause = [['rating', 'DESC'], ['createdAt', 'DESC']];
        break;
      case 'newest':
        orderClause = [['createdAt', 'DESC']];
        break;
      default:
        orderClause = [['createdAt', 'DESC']];
    }

    console.log('Filter params:', { search, category, minPrice, maxPrice, sortBy });
    console.log('Where clause:', JSON.stringify(whereClause, null, 2));
    console.log('Order clause:', orderClause);

    const products = await Product.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: orderClause
    });

    res.json({
      products: products.rows,
      totalPages: Math.ceil(products.count / limit),
      currentPage: parseInt(page),
      totalProducts: products.count,
      filters: {
        search: search || '',
        category: category || '',
        minPrice: minPrice || null,
        maxPrice: maxPrice || null,
        sortBy: sortBy || ''
      }
    });
  } catch (error) {
    console.error('Products route error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create product (protected route)
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, price, image, stock, category } = req.body;
    const product = await Product.create({
      name,
      description,
      price,
      image,
      stock,
      category // Make sure your Product model has a category field
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get unique categories (helpful for populating filter dropdown)
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Product.findAll({
      attributes: ['category'],
      group: ['category'],
      where: {
        category: {
          [Op.not]: null,
          [Op.ne]: ''
        }
      }
    });
    
    res.json({
      categories: categories.map(item => item.category).filter(Boolean)
    });
  } catch (error) {
    console.error('Categories route error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;