import React, { useEffect, useState } from 'react';
import { getStylists, getImageUrl, createAppointment } from '../api';
import './LandingPage.css';

export default function LandingPage() {
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Booking Modal State
  const [selectedHairstyle, setSelectedHairstyle] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    client_address: '',
    appointment_date: '',
  });

  useEffect(() => {
    fetchStylists();
  }, []);

  const fetchStylists = async () => {
    try {
      const data = await getStylists();
      setStylists(data);
    } catch (error) {
      console.error('Failed to fetch stylists from Django:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedHairstyle) return;

    const payload = {
      ...formData,
      stylist: selectedHairstyle.stylistId,
      hairstyle: selectedHairstyle.id,
      status: 'PENDING',
    };

    try {
      await createAppointment(payload);
      setBookingSuccess(true);
      setSelectedHairstyle(null);
      setFormData({
        client_name: '',
        client_email: '',
        client_phone: '',
        client_address: '',
        appointment_date: '',
      });
    } catch (error) {
      console.error('Booking failed:', error.response?.data || error);
    }
  };

  // Filter Logic
  const categories = ['All', 'Knotless Braids', 'Locs', 'Wig Installation', 'Silk Press', 'Twists'];

  const filteredStylists = stylists.filter((stylist) => {
    const matchesSearch = stylist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          stylist.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="landing-container">
      {/* Top Navbar */}
      <nav className="navbar">
        <div className="nav-brand">
          <span className="logo-icon">O</span>
          <span className="brand-name">OAK Appointments</span>
        </div>
        <div className="nav-links">
          <a href="#stylists">Explore Stylists</a>
          <a href="#how-it-works">How it Works</a>
          <button className="btn-primary-sm">Book Home Service</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">Verified Home Hair Stylists</span>
          <h1>Professional Hair Styling Delivered to Your Doorstep</h1>
          <p>Book top-rated, vetted braiders and hair stylists for seamless on-demand home appointments.</p>
          
          {/* Search Bar */}
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Search by stylist name or location (e.g. Lekki, Ikeja)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn-search">Search</button>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="category-section" id="stylists">
        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Success Alert */}
      {bookingSuccess && (
        <div className="alert-banner">
          Appointment requested successfully. Your stylist will reach out to confirm your slot.
        </div>
      )}

      {/* Stylist Grid Section */}
      <main className="main-content">
        <div className="section-header">
          <h2>Featured Home Stylists</h2>
          <p>{filteredStylists.length} available stylists near you</p>
        </div>

        {loading ? (
          <div className="loading-state">Loading stylists...</div>
        ) : (
          <div className="stylist-grid">
            {filteredStylists.map((stylist) => (
              <div key={stylist.id} className="stylist-card">
                {/* Cover & Avatar Header */}
                <div className="card-media">
                  <img 
                    src={getImageUrl(stylist.cover_image)} 
                    alt={`${stylist.name} work preview`} 
                    className="cover-img"
                  />
                  <img 
                    src={getImageUrl(stylist.profile_image)} 
                    alt={stylist.name} 
                    className="avatar-img"
                  />
                  {stylist.is_verified && <span className="badge-verified">Verified Pro</span>}
                </div>

                {/* Card Body */}
                <div className="card-details">
                  <div className="card-title-row">
                    <h3>{stylist.name}</h3>
                    <div className="rating-tag">
                      <span>{stylist.rating} rating</span>
                      <span className="reviews">({stylist.review_count})</span>
                    </div>
                  </div>

                  <p className="location-text">{stylist.location} (Travel fee: NGN {Number(stylist.travel_fee || 0).toLocaleString()})</p>
                  <p className="bio-text">{stylist.bio}</p>

                  <div className="menu-divider"></div>

                  {/* Hairstyle Menu */}
                  <div className="services-menu">
                    <h4>Select Service to Book</h4>
                    {stylist.styles && stylist.styles.length > 0 ? (
                      stylist.styles.map((style) => (
                        <div key={style.id} className="service-row">
                          <div className="service-info">
                            <span className="service-name">{style.name}</span>
                            <span className="service-price">NGN {Number(style.price).toLocaleString()}</span>
                          </div>
                          <button 
                            className="btn-select"
                            onClick={() => setSelectedHairstyle({ ...style, stylistId: stylist.id, stylistName: stylist.name })}
                          >
                            Book
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="no-services">No hairstyles listed yet.</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Booking Drawer Modal */}
      {selectedHairstyle && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Book Home Session</h3>
              <button className="btn-close" onClick={() => setSelectedHairstyle(null)} aria-label="Close booking form">x</button>
            </div>

            <div className="selected-summary">
              <div>
                <strong>{selectedHairstyle.name}</strong>
                <p>Stylist: {selectedHairstyle.stylistName}</p>
              </div>
              <span className="total-price">NGN {Number(selectedHairstyle.price).toLocaleString()}</span>
            </div>

            <form onSubmit={handleBookingSubmit} className="booking-form">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Enter your full name"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="name@email.com"
                    value={formData.client_email}
                    onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="08012345678"
                    value={formData.client_phone}
                    onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Home Address (Where the session takes place)</label>
                <textarea 
                  required 
                  placeholder="Street address, apartment/suite number, area"
                  value={formData.client_address}
                  onChange={(e) => setFormData({ ...formData, client_address: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Preferred Date & Time</label>
                <input 
                  type="datetime-local" 
                  required 
                  value={formData.appointment_date}
                  onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-submit-booking">Confirm Booking Request</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
