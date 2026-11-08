
import { useState } from 'react'
import keycloak from './keycloak'
import './App.css'

function App() {
  const [restaurants, setRestaurants] = useState([])
  const [customer, setCustomer] = useState(null)
  const [overview, setOverview] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const API_URL = ''

  const loadCustomerProfile = async () => {
    try {
      setLoading(true)
      setMessage('Loading customer profile...')
      await keycloak.updateToken(30)

      const response = await fetch(`${API_URL}/api/customers/me`, {
        headers: { Authorization: `Bearer ${keycloak.token}` },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`)
      }

      setCustomer(await response.json())
      setMessage('Customer profile loaded successfully!')
    } catch (error) {
      console.error(error)
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const loadCustomerOverview = async () => {
    try {
      setLoading(true)
      setMessage('Loading your dashboard...')
      await keycloak.updateToken(30)

      const response = await fetch(
        `${API_URL}/api/customers/me/overview`,
        {
          headers: { Authorization: `Bearer ${keycloak.token}` },
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`)
      }

      setOverview(await response.json())
      setMessage('Dashboard loaded successfully!')
    } catch (error) {
      console.error(error)
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const loadRestaurants = async () => {
    try {
      setLoading(true)
      setMessage('Loading restaurants...')
      await keycloak.updateToken(30)

      const response = await fetch(`${API_URL}/api/restaurants`, {
        headers: { Authorization: `Bearer ${keycloak.token}` },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`)
      }

      const data = await response.json()
      setRestaurants(data.content ?? [])
      setMessage('Restaurants loaded successfully!')
    } catch (error) {
      console.error(error)
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const createRestaurant = async () => {
    try {
      setLoading(true)
      setMessage('Creating restaurant...')
      await keycloak.updateToken(30)

      const response = await fetch(`${API_URL}/api/restaurants/me`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Siwar Restaurant',
          description: 'A test restaurant for the Food Delivery Platform project.',
          cuisineType: 'Tunisian',
          street: 'Avenue Habib Bourguiba',
          city: 'Tunis',
          state: 'Tunis',
          postalCode: '1000',
          country: 'Tunisia',
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`)
      }

      setMessage('Restaurant created successfully!')
      await loadRestaurants()
    } catch (error) {
      console.error(error)
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    keycloak.logout({ redirectUri: window.location.origin })
  }

  const isAuthenticated = keycloak.authenticated
  const username = keycloak.tokenParsed?.preferred_username

  return (
    <div className="app-shell">

      {/* NAVBAR */}
      <header className="navbar">
        <div className="container navbar-inner">
          <a href="#home" className="brand">
            <span className="brand-icon">🍴</span>
            <span>Food<span style={{ color: '#e97835' }}>ie.</span></span>
          </a>

          <nav className="nav-links">
            <a href="#home">Home</a>
            <a href="#restaurants">Restaurants</a>
            {isAuthenticated && <a href="#dashboard">My Dashboard</a>}
            <a href="#about">About</a>
          </nav>

          <div className="nav-actions">
            {isAuthenticated ? (
              <button className="btn btn-primary" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => keycloak.login()}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <main>
        <section className="hero-section" id="home">
          <div className="container">
            <div className="hero">
              <div className="hero-content">
                <div className="eyebrow">GOOD FOOD, GOOD MOOD</div>
                <h1>
                  Delicious food,<br />
                  delivered <span>to you.</span>
                </h1>
                <p>
                  Discover amazing restaurants and enjoy your favorite meals.
                  Your next delicious experience is just a few clicks away.
                </p>
                <a href="#restaurants" className="btn btn-primary">
                  Explore Restaurants →
                </a>
              </div>

              <img
                className="hero-image"
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800"
                alt="Delicious pizza"
              />
            </div>
          </div>
        </section>

        {/* RESTAURANTS */}
        <section className="section" id="restaurants">
          <div className="container">
            <div className="section-heading">
              <div>
                <div className="eyebrow">DISCOVER YOUR NEXT MEAL</div>
                <h2>Explore Restaurants</h2>
                <p>Find delicious places and discover new flavors.</p>
              </div>

              <button
                className="btn btn-outline"
                onClick={loadRestaurants}
                disabled={loading || !isAuthenticated}
              >
                {loading ? 'Loading...' : 'Load Restaurants'}
              </button>
            </div>

            {!isAuthenticated && (
              <div className="empty-state">
                Login to discover restaurants from our platform.
              </div>
            )}

            {isAuthenticated && restaurants.length === 0 && (
              <div className="empty-state">
                No restaurants loaded yet. Click "Load Restaurants" to see
                available restaurants.
              </div>
            )}

            <div className="restaurant-grid">
              {restaurants.map((restaurant, index) => (
                <article className="restaurant-card" key={restaurant.id ?? index}>
                  <div
                    className="restaurant-image"
                    style={{
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '64px',
                      background: ['#f9e8d8', '#f5e8d1', '#f7e2dc'][index % 3],
                    }}
                  >
                    🍽️
                  </div>

                  <div className="restaurant-info">
                    <span className="restaurant-tag">
                      {restaurant.cuisineType}
                    </span>
                    <h3>{restaurant.name}</h3>
                    <p>{restaurant.description}</p>
                    <p>📍 {restaurant.city}, {restaurant.country}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CUSTOMER DASHBOARD */}
        {isAuthenticated && (
          <section className="dashboard-section" id="dashboard">
            <div className="container">
              <div className="dashboard-header">
                <div className="eyebrow">YOUR PERSONAL SPACE</div>
                <h1>Welcome, {username} 👋</h1>
                <p className="muted">
                  Manage your profile, addresses and orders in one place.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary"
                  onClick={loadCustomerOverview}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load My Dashboard'}
                </button>

                <button
                  className="btn btn-outline"
                  onClick={loadCustomerProfile}
                  disabled={loading}
                >
                  Load My Profile
                </button>

                <button
                  className="btn btn-outline"
                  onClick={createRestaurant}
                  disabled={loading}
                >
                  Create Test Restaurant
                </button>
              </div>

              {message && <div className="feedback">{message}</div>}

              {customer && (
                <div className="dashboard-card" style={{ marginTop: 20 }}>
                  <h3>My Customer Profile</h3>
                  <p><strong>Customer ID:</strong> {customer.id}</p>
                  <p><strong>Name:</strong> {customer.firstName} {customer.lastName}</p>
                  <p><strong>Email:</strong> {customer.email}</p>
                  <p><strong>Phone:</strong> {customer.phoneNumber}</p>
                </div>
              )}

              {overview && (
                <>
                  <div className="dashboard-grid" style={{ marginTop: 25 }}>
                    <div className="dashboard-card">
                      <h3>👤 My Profile</h3>
                      <p>
                        <strong>Name:</strong>{' '}
                        {overview.profile?.firstName} {overview.profile?.lastName}
                      </p>
                      <p><strong>Email:</strong> {overview.profile?.email}</p>
                      <p><strong>Phone:</strong> {overview.profile?.phoneNumber}</p>
                    </div>

                    <div className="dashboard-card">
                      <h3>📍 My Addresses</h3>
                      {!overview.addresses?.length ? (
                        <p>No addresses registered yet.</p>
                      ) : (
                        overview.addresses.map((address) => (
                          <div className="order-item" key={address.id}>
                            <strong>{address.label}</strong>
                            <p>{address.street}</p>
                            <p>
                              {address.city}, {address.state} {address.postalCode}
                            </p>
                            <p>{address.country}</p>
                            {address.isDefault && (
                              <span className="default-label">Default Address</span>
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    <div className="dashboard-card">
                      <h3>🛍️ My Orders</h3>
                      {!overview.orders?.length ? (
                        <p>No orders found yet.</p>
                      ) : (
                        overview.orders.map((order) => (
                          <div className="order-item" key={order.id}>
                            <strong>Order #{order.id}</strong>
                            <p>Restaurant: {order.restaurantId}</p>
                            <p>Total: {order.totalAmount}</p>
                            <p>
                              <span className="status-label">{order.status}</span>
                            </p>
                            <p>
                              Delivery: {order.deliveryStatus ?? 'Not available'}
                            </p>
                            <p>
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleString()
                                : 'Date unavailable'}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        {/* ABOUT */}
        <section className="section" id="about">
          <div className="container">
            <div className="section-heading">
              <div>
                <div className="eyebrow">ABOUT OUR PLATFORM</div>
                <h2>Food brings us together.</h2>
                <p>
                  Discover restaurants, explore meals and manage your food
                  delivery experience with ease.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <p>© 2026 Foodie. Food Delivery Platform.</p>
        </div>
      </footer>
    </div>
  )
}

export default App

