
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ManageCompanies.css'

function ManageCompanies() {

  const navigate = useNavigate()

  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [creating, setCreating] = useState(false)

  const [formData, setFormData] = useState({
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    website: '',
    location: '',
    industry: '',
    description: ''
  })

  const token = localStorage.getItem('token')

  const fetchCompanies = async () => {

    try {

      setLoading(true)
      setError('')

      const response = await fetch(
        'https://careerbridge-backend-7jme.onrender.com/api/admin/companies',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch companies')
      }

      setCompanies(data.data || [])

    } catch (err) {

      setError(err.message)

    } finally {

      setLoading(false)

    }

  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  const handleInputChange = (event) => {

    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })

  }

  const handleCreateCompany = async (event) => {

    event.preventDefault()

    try {

      setCreating(true)

      const response = await fetch(
        'https://careerbridge-backend-7jme.onrender.com/api/admin/companies',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create company')
      }

      alert('Company created successfully')

      setFormData({
        companyName: '',
        companyEmail: '',
        companyPhone: '',
        website: '',
        location: '',
        industry: '',
        description: ''
      })

      setShowForm(false)

      fetchCompanies()

    } catch (err) {

      alert(err.message)

    } finally {

      setCreating(false)

    }

  }

  const handleDelete = async (companyId) => {

    const confirmed = window.confirm(
      'Are you sure you want to delete this company?'
    )

    if (!confirmed) {
      return
    }

    try {

      const response = await fetch(
        `https://careerbridge-backend-7jme.onrender.com/api/admin/companies/${companyId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete company')
      }

      setCompanies((prevCompanies) =>
        prevCompanies.filter(
          (company) => company.id !== companyId
        )
      )

      alert('Company deleted successfully')

    } catch (err) {

      alert(err.message)

    }

  }

  const handleCancelForm = () => {

    setFormData({
      companyName: '',
      companyEmail: '',
      companyPhone: '',
      website: '',
      location: '',
      industry: '',
      description: ''
    })

    setShowForm(false)

  }

  return (

    <div className="manage-companies-page">

      <div className="manage-companies-header">

        <div>
          <h1>Manage Companies</h1>
          <p>View and manage all CareerBridge companies</p>
        </div>

        <button
          className="companies-back-button"
          onClick={() => navigate('/admin/dashboard')}
        >
          ← Back to Dashboard
        </button>

      </div>


      {!showForm && !loading && !error && (

        <div className="companies-top-actions">

          <button
            className="add-company-button"
            onClick={() => setShowForm(true)}
          >
            + Add Company
          </button>

        </div>

      )}


      {showForm && (

        <div className="company-form-card">

          <div className="company-form-header">

            <div>
              <h2>Add New Company</h2>
              <p>Create a company for recruiters to join.</p>
            </div>

            <button
              className="close-company-form"
              onClick={handleCancelForm}
              type="button"
            >
              ×
            </button>

          </div>


          <form onSubmit={handleCreateCompany}>

            <div className="company-form-grid">

              <div className="company-form-field">

                <label>Company Name</label>

                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                  required
                />

              </div>


              <div className="company-form-field">

                <label>Company Email</label>

                <input
                  type="email"
                  name="companyEmail"
                  value={formData.companyEmail}
                  onChange={handleInputChange}
                  placeholder="Enter company email"
                  required
                />

              </div>


              <div className="company-form-field">

                <label>Company Phone</label>

                <input
                  type="text"
                  name="companyPhone"
                  value={formData.companyPhone}
                  onChange={handleInputChange}
                  placeholder="Enter company phone"
                  required
                />

              </div>


              <div className="company-form-field">

                <label>Website</label>

                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                />

              </div>


              <div className="company-form-field">

                <label>Location</label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter company location"
                  required
                />

              </div>


              <div className="company-form-field">

                <label>Industry</label>

                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  placeholder="e.g. Information Technology"
                  required
                />

              </div>


              <div className="company-form-field company-description-field">

                <label>Description</label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter company description"
                  rows="5"
                  required
                />

              </div>

            </div>


            <div className="company-form-buttons">

              <button
                type="button"
                className="cancel-company-button"
                onClick={handleCancelForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-company-button"
                disabled={creating}
              >
                {creating ? 'Creating...' : 'Create Company'}
              </button>

            </div>

          </form>

        </div>

      )}


      {loading && (

        <div className="companies-message">
          Loading companies...
        </div>

      )}


      {error && (

        <div className="companies-error">

          <p>{error}</p>

          <button onClick={fetchCompanies}>
            Retry
          </button>

        </div>

      )}


      {!loading && !error && !showForm && (

        <div className="companies-card">

          <div className="companies-card-header">

            <h2>All Companies</h2>

            <span>
              {companies.length} companies
            </span>

          </div>


          {companies.length === 0 ? (

            <div className="empty-companies">
              No companies found.
            </div>

          ) : (

            <div className="companies-table-container">

              <table className="companies-table">

                <thead>

                  <tr>
                    <th>ID</th>
                    <th>Company</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Location</th>
                    <th>Industry</th>
                    <th>Website</th>
                    <th>Actions</th>
                  </tr>

                </thead>


                <tbody>

                  {companies.map((company) => (

                    <tr key={company.id}>

                      <td>
                        {company.id}
                      </td>

                      <td>
                        <strong>
                          {company.companyName}
                        </strong>
                      </td>

                      <td>
                        {company.companyEmail}
                      </td>

                      <td>
                        {company.companyPhone}
                      </td>

                      <td>
                        {company.location}
                      </td>

                      <td>
                        {company.industry}
                      </td>

                      <td>

                        {company.website ? (

                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Visit
                          </a>

                        ) : (
                          'N/A'
                        )}

                      </td>

                      <td>

                        <button
                          className="delete-company-button"
                          onClick={() =>
                            handleDelete(company.id)
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      )}

    </div>

  )
}

export default ManageCompanies
