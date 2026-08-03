import { useEffect, useState } from 'react'
import { createAppointment, getImageUrl, getStylists } from '../api.js'

const emptyForm = {
  client_name: '',
  client_email: '',
  client_phone: '',
  client_address: '',
  appointment_date: '',
}

function initialsFor(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export default function StylistGrid() {
  const [stylists, setStylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedHairstyle, setSelectedHairstyle] = useState(null)
  const [bookingSuccess, setBookingSuccess] = useState('')
  const [formData, setFormData] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function loadStylists() {
      try {
        const data = await getStylists()
        setStylists(data)
      } catch (err) {
        setError('Unable to load stylists from Django right now.')
        console.error('Failed to fetch stylists from Django:', err)
      } finally {
        setLoading(false)
      }
    }

    loadStylists()
  }, [])

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }))
  }

  const handleBookingSubmit = async (event) => {
    event.preventDefault()
    if (!selectedHairstyle) return

    setSubmitting(true)
    setError('')

    try {
      await createAppointment({
        ...formData,
        stylist: selectedHairstyle.stylistId,
        hairstyle: selectedHairstyle.id,
        status: 'PENDING',
      })

      setBookingSuccess(`${selectedHairstyle.name} appointment request sent.`)
      setSelectedHairstyle(null)
      setFormData(emptyForm)
    } catch (err) {
      setError('Booking failed. Please check the form and try again.')
      console.error('Booking failed:', err.response?.data || err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Oak Appointments</p>
          <h1>Book a stylist</h1>
        </div>
        <div className="api-status">
          <span className={error ? 'status-dot error' : 'status-dot'} />
          {error ? 'API issue' : 'Django API connected'}
        </div>
      </header>

      {bookingSuccess && <div className="notice success">{bookingSuccess}</div>}
      {error && <div className="notice error">{error}</div>}

      {loading ? (
        <section className="state-panel">Loading stylists...</section>
      ) : stylists.length === 0 ? (
        <section className="state-panel">No stylists have been added yet.</section>
      ) : (
        <section className="stylist-grid" aria-label="Featured stylists">
          {stylists.map((stylist) => (
            <article key={stylist.id} className="stylist-card">
              <div className="cover">
                {stylist.cover_image ? (
                  <img src={getImageUrl(stylist.cover_image)} alt="" />
                ) : (
                  <div className="cover-fallback" />
                )}
                <div className="avatar">
                  {stylist.profile_image ? (
                    <img src={getImageUrl(stylist.profile_image)} alt="" />
                  ) : (
                    initialsFor(stylist.name)
                  )}
                </div>
              </div>

              <div className="card-body">
                <div className="title-row">
                  <div>
                    <h2>{stylist.name}</h2>
                    <p>{stylist.location}</p>
                  </div>
                  <div className="rating">
                    <strong>{stylist.rating}</strong>
                    <span>{stylist.review_count} reviews</span>
                  </div>
                </div>

                <p className="bio">{stylist.bio || 'Independent stylist available for appointment requests.'}</p>

                <div className="styles-list">
                  <h3>Styles</h3>
                  {stylist.styles?.length ? (
                    stylist.styles.map((style) => (
                      <div key={style.id} className="style-item">
                        <div>
                          <strong>{style.name}</strong>
                          <span>NGN {Number(style.price).toLocaleString()}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedHairstyle({ ...style, stylistId: stylist.id })}
                        >
                          Book
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="empty-copy">No styles listed yet.</p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {selectedHairstyle && (
        <div className="modal-overlay" role="presentation">
          <section className="modal" role="dialog" aria-modal="true" aria-labelledby="booking-title">
            <div className="modal-header">
              <div>
                <p className="eyebrow">Appointment request</p>
                <h2 id="booking-title">{selectedHairstyle.name}</h2>
              </div>
              <strong>NGN {Number(selectedHairstyle.price).toLocaleString()}</strong>
            </div>

            <form onSubmit={handleBookingSubmit}>
              <label>
                Full name
                <input
                  type="text"
                  required
                  value={formData.client_name}
                  onChange={(event) => updateField('client_name', event.target.value)}
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  required
                  value={formData.client_email}
                  onChange={(event) => updateField('client_email', event.target.value)}
                />
              </label>
              <label>
                Phone
                <input
                  type="tel"
                  required
                  value={formData.client_phone}
                  onChange={(event) => updateField('client_phone', event.target.value)}
                />
              </label>
              <label>
                Address
                <textarea
                  required
                  value={formData.client_address}
                  onChange={(event) => updateField('client_address', event.target.value)}
                />
              </label>
              <label>
                Date and time
                <input
                  type="datetime-local"
                  required
                  value={formData.appointment_date}
                  onChange={(event) => updateField('appointment_date', event.target.value)}
                />
              </label>

              <div className="modal-actions">
                <button type="button" className="secondary" onClick={() => setSelectedHairstyle(null)}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Confirm'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  )
}
