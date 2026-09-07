import React, { useEffect, useState } from 'react'
import './MyApplications.css'
import { useNavigate } from 'react-router-dom'

function MyApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      setError('')

      const token = localStorage.getItem('token')

      const response = await fetch(
        'https://careerbridge-backend-7jme.onrender.com/api/job-applications/my-applications',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      console.log('MY APPLICATIONS RESPONSE:', data)

      if (!response.ok || !(data.success || data.sucess)) {
        throw new Error(
          data.message || 'Failed to fetch applications'
        )
      }

      setApplications(data.data || [])
    } catch (error) {
      console.error('Error fetching applications:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusClass = (status) => {
    if (!status) return ''

    return status.toLowerCase()
  }

  if (loading) {
    return (
      <div className="applications-container">
        <h1>My Applications</h1>

        <div className="applications-loading">
          Loading your applications...
        </div>
      </div>
    )
  }

  return (
    <div className="applications-container">

      <div className="applications-header">
        <div>
          <h1>My Applications</h1>
          <p>Track the status of your job applications.</p>
        </div>

        <button
          className="applications-dashboard-button"
          onClick={() => navigate('/dashboard')}
        >
          Dashboard
        </button>
      </div>

      {error && (
        <div className="applications-error">
          {error}
        </div>
      )}

      {!error && applications.length === 0 && (
        <div className="no-applications">
          <h2>No Applications Yet</h2>
          <p>
            You haven't applied for any jobs yet.
          </p>

          <button
            onClick={() => navigate('/jobs')}
          >
            Browse Jobs
          </button>
        </div>
      )}

      {!error && applications.length > 0 && (
        <div className="applications-list">

          {applications.map((application) => (

            <div
              className="application-card"
              key={application.applicationId}
            >

              <h2>
                {application.jobTitle}
              </h2>

              <p>
                <strong>Company:</strong>{' '}
                {application.companyName}
              </p>

              <p>
                <strong>Location:</strong>{' '}
                {application.jobLocation}
              </p>

              <p>
                <strong>Status:</strong>{' '}

                <span
                  className={`status-badge ${getStatusClass(
                    application.status
                  )}`}
                >
                  {application.status}
                </span>
              </p>

              <p>
                <strong>Applied At:</strong>{' '}

                {application.appliedAt
                  ? new Date(
                      application.appliedAt
                    ).toLocaleString()
                  : '-'}
              </p>

              <button
                onClick={() =>
                  navigate(
                    `/jobs/${application.jobId}`
                  )
                }
              >
                View Job
              </button>

            </div>

          ))}

        </div>
      )}

    </div>
  )
}

export default MyApplications