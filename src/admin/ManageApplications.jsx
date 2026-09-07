
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ManageApplications.css'

const ManageApplications = () => {
  const navigate = useNavigate()

  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchApplications = async () => {
    try {
      setLoading(true)
      setError('')

      const token = localStorage.getItem('token')

      const response = await fetch(
        'http://localhost:8086/api/admin/applications',
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
        throw new Error(data.message || 'Failed to fetch applications')
      }

      if (data.success || data.sucess) {
        setApplications(data.data || [])
      } else {
        throw new Error(data.message || 'Failed to fetch applications')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const formatDate = (date) => {
    if (!date) {
      return 'N/A'
    }

    return new Date(date).toLocaleDateString('en-IN')
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'APPLIED':
        return 'status-applied'

      case 'SHORTLISTED':
        return 'status-shortlisted'

      case 'REJECTED':
        return 'status-rejected'

      case 'SELECTED':
        return 'status-selected'

      default:
        return 'status-default'
    }
  }

  if (loading) {
    return (
      <div className="manage-applications-page">
        <div className="manage-applications-container">
          <div className="applications-header">
            <h1>Manage Applications</h1>
            <p>View all job applications submitted on CareerBridge</p>
          </div>

          <div className="applications-loading">
            Loading applications...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="manage-applications-page">
      <div className="manage-applications-container">

        <div className="applications-header">
          <div>
            <h1>Manage Applications</h1>
            <p>View all job applications submitted on CareerBridge</p>
          </div>

          <button
            className="back-dashboard-btn"
            onClick={() => navigate('/admin/dashboard')}
          >
            ← Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="applications-error">
            <p>{error}</p>

            <button onClick={fetchApplications}>
              Retry
            </button>
          </div>
        )}

        {!error && (
          <div className="applications-section">

            <div className="applications-section-header">
              <h2>All Applications</h2>

              <span className="application-count">
                {applications.length}{' '}
                {applications.length === 1
                  ? 'application'
                  : 'applications'}
              </span>
            </div>

            {applications.length === 0 ? (
              <div className="no-applications">
                <h3>No Applications Found</h3>
                <p>
                  There are currently no job applications on CareerBridge.
                </p>
              </div>
            ) : (
              <div className="applications-table-wrapper">
                <table className="applications-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Applicant</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Job</th>
                      <th>Company</th>
                      <th>Status</th>
                      <th>Applied Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {applications.map((application) => (
                      <tr key={application.applicationId}>

                        <td>
                          {application.applicationId}
                        </td>

                        <td>
                          <div className="applicant-info">
                            <strong>
                              {application.firstName || ''}{' '}
                              {application.lastName || ''}
                            </strong>

                            <span>
                              User ID: {application.userId ?? 'N/A'}
                            </span>
                          </div>
                        </td>

                        <td>
                          {application.email || 'N/A'}
                        </td>

                        <td>
                          {application.phoneNumber || 'N/A'}
                        </td>

                        <td>
                          <strong>
                            {application.jobTitle || 'N/A'}
                          </strong>
                        </td>

                        <td>
                          {application.companyName || 'N/A'}
                        </td>

                        <td>
                          <span
                            className={`application-status ${getStatusClass(
                              application.status
                            )}`}
                          >
                            {application.status || 'N/A'}
                          </span>
                        </td>

                        <td>
                          {formatDate(application.appliedAt)}
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
    </div>
  )
}

export default ManageApplications

