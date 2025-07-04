import React, { useState, useEffect } from 'react';
import { profileAPI, wishlistAPI, cartAPI } from '../utils/api';

const UserProfile = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ name: '', email: '' });

  useEffect(() => {
    fetchProfileData();
    if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'wishlist') {
      fetchWishlist();
    }
  }, [activeTab]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await profileAPI.get();
      setProfileData(response.data);
      setEditData({
        name: response.data.user.name,
        email: response.data.user.email
      });
    } catch (error) {
      setError('Failed to fetch profile data');
      console.error('Profile fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await profileAPI.getOrders();
      setOrders(response.data.orders);
    } catch (error) {
      setError('Failed to fetch orders');
      console.error('Orders fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistAPI.get();
      setWishlist(response.data);
    } catch (error) {
      setError('Failed to fetch wishlist');
      console.error('Wishlist fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await profileAPI.update(editData);
      await fetchProfileData();
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await wishlistAPI.remove(productId);
      setWishlist(wishlist.filter(item => item.productId !== productId));
      alert('Product removed from wishlist');
    } catch (error) {
      alert('Failed to remove from wishlist');
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await cartAPI.add(productId, 1);
      alert('Product added to cart!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#ffc107',
      'confirmed': '#28a745',
      'processing': '#007bff',
      'shipped': '#17a2b8',
      'delivered': '#28a745',
      'cancelled': '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  if (loading) {
    return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <div style={styles.loading}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2>My Profile</h2>
          <button style={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div style={styles.content}>
          {/* Tab Navigation */}
          <div style={styles.tabs}>
            <button
              style={{
                ...styles.tab,
                ...(activeTab === 'profile' ? styles.activeTab : {})
              }}
              onClick={() => setActiveTab('profile')}
            >
              👤 Profile
            </button>
            <button
              style={{
                ...styles.tab,
                ...(activeTab === 'orders' ? styles.activeTab : {})
              }}
              onClick={() => setActiveTab('orders')}
            >
              📦 Orders ({profileData?.stats?.totalOrders || 0})
            </button>
            <button
              style={{
                ...styles.tab,
                ...(activeTab === 'wishlist' ? styles.activeTab : {})
              }}
              onClick={() => setActiveTab('wishlist')}
            >
              ❤️ Wishlist ({profileData?.stats?.wishlistItems || 0})
            </button>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          {/* Tab Content */}
          {activeTab === 'profile' && (
            <div style={styles.tabContent}>
              <div style={styles.profileStats}>
                <div style={styles.statCard}>
                  <div style={styles.statNumber}>{profileData?.stats?.totalOrders || 0}</div>
                  <div style={styles.statLabel}>Total Orders</div>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statNumber}>{profileData?.stats?.wishlistItems || 0}</div>
                  <div style={styles.statLabel}>Wishlist Items</div>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statNumber}>
                    {profileData?.stats?.memberSince ? 
                      new Date(profileData.stats.memberSince).getFullYear() : 'N/A'}
                  </div>
                  <div style={styles.statLabel}>Member Since</div>
                </div>
              </div>

              <div style={styles.profileInfo}>
                <h3>Profile Information</h3>
                {!editMode ? (
                  <div style={styles.profileDisplay}>
                    <div style={styles.infoRow}>
                      <strong>Name:</strong> {profileData?.user?.name}
                    </div>
                    <div style={styles.infoRow}>
                      <strong>Email:</strong> {profileData?.user?.email}
                    </div>
                    <div style={styles.infoRow}>
                      <strong>Member Since:</strong> {formatDate(profileData?.user?.createdAt)}
                    </div>
                    <button style={styles.editBtn} onClick={() => setEditMode(true)}>
                      Edit Profile
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateProfile} style={styles.editForm}>
                    <div style={styles.formGroup}>
                      <label>Name:</label>
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                        style={styles.input}
                        required
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label>Email:</label>
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                        style={styles.input}
                        required
                      />
                    </div>
                    <div style={styles.formActions}>
                      <button type="button" style={styles.cancelBtn} onClick={() => setEditMode(false)}>
                        Cancel
                      </button>
                      <button type="submit" style={styles.saveBtn}>
                        Save Changes
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div style={styles.tabContent}>
              <h3>Order History</h3>
              {orders.length === 0 ? (
                <div style={styles.emptyState}>
                  <p>No orders found</p>
                  <p>Start shopping to see your orders here!</p>
                </div>
              ) : (
                <div style={styles.ordersList}>
                  {orders.map(order => (
                    <div key={order.id} style={styles.orderCard}>
                      <div style={styles.orderHeader}>
                        <div>
                          <strong>Order #{order.orderNumber}</strong>
                          <div style={styles.orderDate}>{formatDate(order.createdAt)}</div>
                        </div>
                        <div style={styles.orderStatus}>
                          <span 
                            style={{
                              ...styles.statusBadge,
                              backgroundColor: getStatusColor(order.status)
                            }}
                          >
                            {order.status.toUpperCase()}
                          </span>
                          <div style={styles.orderTotal}>₹{order.totalAmount}</div>
                        </div>
                      </div>
                      <div style={styles.orderItems}>
                        {order.OrderItems?.map(item => (
                          <div key={item.id} style={styles.orderItem}>
                            <span>{item.productName} × {item.quantity}</span>
                            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div style={styles.orderFooter}>
                        <span style={styles.paymentMethod}>
                          Payment: {order.paymentMethod?.toUpperCase()}
                        </span>
                        <span style={styles.paymentStatus}>
                          {order.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div style={styles.tabContent}>
              <h3>My Wishlist</h3>
              {wishlist.length === 0 ? (
                <div style={styles.emptyState}>
                  <p>Your wishlist is empty</p>
                  <p>Add products you love to see them here!</p>
                </div>
              ) : (
                <div style={styles.wishlistGrid}>
                  {wishlist.map(item => (
                    <div key={item.id} style={styles.wishlistCard}>
                      <img 
                        src={item.Product?.image || 'https://via.placeholder.com/200x150'} 
                        alt={item.Product?.name}
                        style={styles.wishlistImage}
                      />
                      <div style={styles.wishlistInfo}>
                        <h4 style={styles.wishlistName}>{item.Product?.name}</h4>
                        <p style={styles.wishlistPrice}>₹{item.Product?.price}</p>
                        <p style={styles.wishlistStock}>
                          {item.Product?.stock > 0 ? 
                            `${item.Product.stock} in stock` : 
                            'Out of stock'
                          }
                        </p>
                        <div style={styles.wishlistActions}>
                          <button 
                            style={styles.addToCartBtn}
                            onClick={() => handleAddToCart(item.productId)}
                            disabled={item.Product?.stock === 0}
                          >
                            {item.Product?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                          </button>
                          <button 
                            style={styles.removeBtn}
                            onClick={() => handleRemoveFromWishlist(item.productId)}
                          >
                            Remove
                          </button>
                        </div>
                        <div style={styles.addedDate}>
                          Added {formatDate(item.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
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
    borderRadius: '12px',
    width: '90%',
    maxWidth: '900px',
    maxHeight: '90%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid #eee',
    backgroundColor: '#f8f9fa'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.5rem'
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    fontSize: '1.2rem'
  },
  error: {
    color: 'red',
    padding: '1rem',
    backgroundColor: '#ffebee',
    margin: '1rem',
    borderRadius: '4px'
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid #eee',
    backgroundColor: '#f8f9fa'
  },
  tab: {
    flex: 1,
    padding: '1rem',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.2s'
  },
  activeTab: {
    backgroundColor: 'white',
    borderBottom: '2px solid #007bff',
    color: '#007bff'
  },
  tabContent: {
    flex: 1,
    padding: '1.5rem',
    overflow: 'auto'
  },
  profileStats: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem'
  },
  statCard: {
    flex: 1,
    textAlign: 'center',
    padding: '1.5rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #eee'
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: '0.5rem'
  },
  statLabel: {
    color: '#666',
    fontSize: '0.9rem'
  },
  profileInfo: {
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #eee'
  },
  profileDisplay: {
    padding: '1.5rem'
  },
  infoRow: {
    margin: '1rem 0',
    fontSize: '1.1rem'
  },
  editBtn: {
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  editForm: {
    padding: '1.5rem'
  },
  formGroup: {
    marginBottom: '1rem'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    marginTop: '0.5rem'
  },
  formActions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem'
  },
  cancelBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  saveBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    color: '#666'
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  orderCard: {
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '1.5rem',
    backgroundColor: '#f8f9fa'
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem'
  },
  orderDate: {
    color: '#666',
    fontSize: '0.9rem',
    marginTop: '0.25rem'
  },
  orderStatus: {
    textAlign: 'right'
  },
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    color: 'white',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    display: 'inline-block',
    marginBottom: '0.5rem'
  },
  orderTotal: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#007bff'
  },
  orderItems: {
    marginBottom: '1rem'
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    borderBottom: '1px solid #eee'
  },
  orderFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    color: '#666'
  },
  paymentMethod: {},
  paymentStatus: {},
  wishlistGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem'
  },
  wishlistCard: {
    border: '1px solid #eee',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  wishlistImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover'
  },
  wishlistInfo: {
    padding: '1rem'
  },
  wishlistName: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.1rem',
    color: '#333'
  },
  wishlistPrice: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#007bff'
  },
  wishlistStock: {
    margin: '0 0 1rem 0',
    fontSize: '0.9rem',
    color: '#666'
  },
  wishlistActions: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.5rem'
  },
  addToCartBtn: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  removeBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  addedDate: {
    fontSize: '0.8rem',
    color: '#999',
    textAlign: 'center'
  }
};

export default UserProfile;