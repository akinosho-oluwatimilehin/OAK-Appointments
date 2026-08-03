// src/components/StylistGrid.jsx
import React, { useEffect, useState } from 'react';
import { getStylists, getImageUrl, createAppointment } from '../api';

export default function StylistGrid() {
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHairstyle, setSelectedHairstyle] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Form State for Booking
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

  if (loading) {
    return <div className="loading-spinner">Loading stylists near you...</div>;
  }

  return (
    <div className="container">
      <h2>Featured Stylists</h2>

      {bookingSuccess && (
        <div className="alert-success">
          🎉 Appointment booked successfully! Your stylist will confirm soon.
        </div>
      )}

      {/* Stylists Grid */}
      <div className="grid">
        {stylists.map((stylist) => (
          <div key={stylist.id} className="stylist-card">
            
            {/* Header / Cover */}
            <div className="card-header">
              <img 
                src={getImageUrl(stylist.cover_image)} 
                alt={`${stylist.name} cover`} 
                className="cover-img"
              />
              <img 
                src={getImageUrl(stylist.profile_image)} 
                alt={stylist.name} 
                className="profile-avatar"
              />
            </div>

            {/* Body */}
            <div className="card-body">
              <div className="title-row">
                <h3>{stylist.name} {stylist.is_verified && <span className="verified">✓</span>}</h3>
                <span className="rating">⭐ {stylist.rating} ({stylist.review_count})</span>
              </div>
              
              <p className="location">📍 {stylist.location}</p>
              <p className="bio">{stylist.bio}</p>

              {/* Nested Hairstyles Menu */}
              <h4>Available Styles</h4>
              <div className="styles-list">
                {stylist.styles && stylist.styles.length > 0 ? (
                  stylist.styles.map((style) => (
                    <div key={style.id} className="style-item">
                      <div>
                        <strong>{style.name}</strong>
                        <p className="price">₦{Number(style.price).toLocaleString()}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedHairstyle({ ...style, stylistId: stylist.id })}
                        className="btn-book"
                      >
                        Book
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="no-styles">No hairstyles listed yet.</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Booking Modal */}
      {selectedHairstyle && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Book {selectedHairstyle.name}</h3>
            <p className="price-tag">Price: ₦{Number(selectedHairstyle.price).toLocaleString()}</p>
            
            <form onSubmit={handleBookingSubmit}>
              <input 
                type="text" 
                placeholder="Full Name" 
                required 
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                required 
                value={formData.client_email}
                onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
              />
              <input 
                type="tel" 
                placeholder="Phone Number (e.g. 08012345678)" 
                required 
                value={formData.client_phone}
                onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
              />
              <textarea 
                placeholder="Home Address for Session" 
                required 
                value={formData.client_address}
                onChange={(e) => setFormData({ ...formData, client_address: e.target.value })}
              />
              <input 
                type="datetime-local" 
                required 
                value={formData.appointment_date}
                onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
              />

              <div className="modal-actions">
                <button type="submit" className="btn-submit">Confirm Booking</button>
                <button type="button" onClick={() => setSelectedHairstyle(null)} className="btn-cancel">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}