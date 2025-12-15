const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
const auth = require('../middleware/auth');

// All routes are protected
router.get('/', auth, getCart);
router.post('/', auth, addToCart);
router.put('/:id', auth, updateCartItem);
router.delete('/:id', auth, removeFromCart);
router.delete('/', auth, clearCart);

module.exports = router;