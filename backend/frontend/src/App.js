import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import CheckoutPage from './pages/CheckoutPage';
import UserProfile from './components/UserProfile';
import { cartAPI } from './utils/api';

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [currentCart, setCurrentCart] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        fetchCartCount();
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const fetchCartCount = async () => {
    try {
      const response = await cartAPI.get();
      const cart = response.data;
      const itemCount = cart.CartItems?.reduce((total, item) => total + item.quantity, 0) || 0;
      setCartItemCount(itemCount);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setShowLogin(false);
    fetchCartCount(); // Fetch cart count after login
  };

  const handleLogout = () => {
    setUser(null);
    setCartItemCount(0);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setShowProfile(false); // Close profile if open
  };

  const handleShowLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const handleShowRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  const handleShowCart = async () => {
    if (!user) {
      alert('Please login to view cart');
      return;
    }
    setShowCart(true);
  };

  const handleShowProfile = () => {
    if (!user) {
      alert('Please login to view profile');
      return;
    }
    setShowProfile(true);
  };

  const handleCloseModals = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowCart(false);
    setShowCheckout(false);
    setShowProfile(false);
    if (user) {
      fetchCartCount(); // Refresh cart count when closing modals
    }
  };

  const handleCheckout = (cart) => {
    setCurrentCart(cart);
    setShowCart(false);
    setShowCheckout(true);
  };

  const handleOrderComplete = () => {
    setCartItemCount(0); // Reset cart count after successful order
  };

  return (
    <div className="App">
      <Navbar 
        user={user}
        cartItemCount={cartItemCount}
        onLogout={handleLogout}
        onShowLogin={handleShowLogin}
        onShowRegister={handleShowRegister}
        onShowCart={handleShowCart}
        onShowProfile={handleShowProfile}
      />
      
      <main>
        <ProductList user={user} />
      </main>

      {showLogin && (
        <Login 
          onLogin={handleLogin}
          onClose={handleCloseModals}
        />
      )}

      {showRegister && (
        <Register 
          onLogin={handleLogin}
          onClose={handleCloseModals}
        />
      )}

      {showCart && (
        <Cart
          onClose={handleCloseModals}
          onCheckout={handleCheckout}
        />
      )}

      {showCheckout && currentCart && (
        <CheckoutPage
          cart={currentCart}
          onClose={handleCloseModals}
          onOrderComplete={handleOrderComplete}
        />
      )}

      {showProfile && (
        <UserProfile
          onClose={handleCloseModals}
        />
      )}
    </div>
  );
}

export default App;