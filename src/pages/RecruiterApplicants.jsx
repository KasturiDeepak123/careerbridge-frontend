import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './RecruiterApplicants.css'

function RecruiterApplicants() {
  const { jobId } = useParams()
  const navigate = useNavigate()

  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchApplicants()
  }, [jobId])

  const fetchApplicants = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(
        `https://careerbridge-backend-7jme.onrender.com/api/job-applications/${jobId}/applicants`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (!response.ok || !(data.success || data.sucess)) {
        throw new Error(data.message || 'Failed to fetch applicants')
      }

      setApplicants(data.data || [])
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (applicationId, status) => {
    try {
      const response = await fetch(
        `http://localhost:8086/api/job-applications/${applicationId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            status: status
          })
        }
      )

      const data = await response.json()

      if (!response.ok || !(data.success || data.sucess)) {
        throw new Error(data.message || 'Failed to update status')
      }

      setApplicants((prevApplicants) =>
        prevApplicants.map((applicant) =>
          applicant.applicationId === applicationId
            ? { ...applicant, status: status }
            : applicant
        )
      )
    } catch (error) {
      alert(error.message)
    }
  }

  if (loading) {
    return (
      <div className="recruiter-applicants-page">
        <div className="applicants-loading">
          Loading applicants...
        </div>
      </div>
    )
  }

  return (
    <div className="recruiter-applicants-page">

      <div className="applicants-header">
        <div>
          <h1>Job Applicants</h1>
          <p>
            Review applicants and update their application status.
          </p>
        </div>

        <button
          className="back-button"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>

      {error && (
        <div className="applicants-error">
          {error}
        </div>
      )}

      {!error && applicants.length === 0 && (
        <div className="no-applicants">
          <h2>No Applicants Yet</h2>
          <p>No one has applied for this job yet.</p>
        </div>
      )}

      {applicants.length > 0 && (
        <div className="applicants-table-wrapper">

          <table className="applicants-table">

            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Applied At</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {applicants.map((applicant) => (

                <tr key={applicant.applicationId}>

                  <td>
                    <div className="applicant-name">
                      {applicant.firstName} {applicant.lastName}
                    </div>
                  </td>

                  <td>
                    {applicant.email}
                  </td>

                  <td>
                    {applicant.phoneNumber}
                  </td>

                  <td>
                    {applicant.appliedAt
                      ? new Date(
                          applicant.appliedAt
                        ).toLocaleString()
                      : '-'}
                  </td>

                  <td>
                    <select
                      className={`status-select status-${applicant.status?.toLowerCase()}`}
                      value={applicant.status}
                      onChange={(e) =>
                        updateStatus(
                          applicant.applicationId,
                          e.target.value
                        )
                      }
                    >
                      <option value="APPLIED">
                        Applied
                      </option>

                      <option value="SHORTLISTED">
                        Shortlisted
                      </option>

                      <option value="INTERVIEW">
                        Interview
                      </option>

                      <option value="SELECTED">
                        Selected
                      </option>

                      <option value="REJECTED">
                        Rejected
                      </option>
                    </select>
                  </td>

                </tr>

              ))}
            </tbody>

          </table>

        </div>
      )}

    </div>
  )
}

export default RecruiterApplicants