import React from 'react';

const Navbar = ({ 
  user, 
  cartItemCount = 0,
  onLogout, 
  onShowLogin, 
  onShowRegister, 
  onShowCart,
  onShowProfile 
}) => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <div style={styles.brand}>
          <div style={styles.logoIcon}>🏪</div>
          <h2 style={styles.brandText}>SimpleStore</h2>
        </div>
        
        <div style={styles.navLinks}>
          {user ? (
            <>
              <button style={styles.iconBtn} onClick={onShowCart} title="Shopping Cart">
                <span style={styles.iconBtnIcon}>🛒</span>
                {cartItemCount > 0 && (
                  <span style={styles.badge}>{cartItemCount}</span>
                )}
              </button>
              
              <div style={styles.userSection}>
                <button style={styles.profileBtn} onClick={onShowProfile}>
                  <div style={styles.avatar}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={styles.userName}>{user.name}</span>
                </button>
                
                <div style={styles.divider}></div>
                
                <button style={styles.logoutBtn} onClick={onLogout}>
                  <span style={styles.logoutIcon}>⚡</span>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div style={styles.authButtons}>
              <button style={styles.loginBtn} onClick={onShowLogin}>
                Sign In
              </button>
              <button style={styles.registerBtn} onClick={onShowRegister}>
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    marginBottom: '2rem'
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  logoIcon: {
    fontSize: '1.5rem',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
  },
  brandText: {
    margin: 0,
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#ffffff',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    letterSpacing: '-0.5px'
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  iconBtn: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    border: 'none',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
  },
  iconBtnIcon: {
    fontSize: '1rem'
  },
  badge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    backgroundColor: '#ff4757',
    color: 'white',
    fontSize: '0.75rem',
    fontWeight: '600',
    padding: '2px 6px',
    borderRadius: '12px',
    minWidth: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(255, 71, 87, 0.4)'
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginLeft: '0.5rem'
  },
  profileBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    color: '#667eea',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
  },
  userName: {
    color: '#ffffff',
    fontSize: '0.95rem',
    fontWeight: '500',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
  },
  divider: {
    width: '1px',
    height: '24px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
  },
  authButtons: {
    display: 'flex',
    gap: '0.75rem'
  },
  loginBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'transparent',
    color: '#ffffff',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(10px)',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
  },
  registerBtn: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #ffffff, #f8f9fa)',
    color: '#667eea',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '600',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 16px rgba(255, 255, 255, 0.2)',
    textShadow: 'none'
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(10px)',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
  },
  logoutIcon: {
    fontSize: '0.9rem'
  }
};

export default Navbar;