import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ManageJobs.css'

function ManageJobs() {
  const navigate = useNavigate()

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')

  const fetchJobs = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(
        'https://careerbridge-backend-7jme.onrender.com/api/admin/jobs',
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
        throw new Error(data.message || 'Failed to fetch jobs')
      }

      setJobs(data.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const handleDelete = async (jobId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this job?'
    )

    if (!confirmed) {
      return
    }

    try {
      const response = await fetch(
        `https://careerbridge-backend-7jme.onrender.com/api/admin/jobs/${jobId}`,
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
        throw new Error(data.message || 'Failed to delete job')
      }

      setJobs((prevJobs) =>
        prevJobs.filter((job) => job.id !== jobId)
      )

      alert('Job deleted successfully')
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="manage-jobs-page">

      <div className="manage-jobs-header">
        <div>
          <h1>Manage Jobs</h1>
          <p>View and manage all CareerBridge jobs</p>
        </div>

        <button
          className="jobs-back-button"
          onClick={() => navigate('/admin/dashboard')}
        >
          ← Back to Dashboard
        </button>
      </div>

      {loading && (
        <div className="jobs-message">
          Loading jobs...
        </div>
      )}

      {error && (
        <div className="jobs-error">
          <p>{error}</p>

          <button onClick={fetchJobs}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="jobs-card">

          <div className="jobs-card-header">
            <h2>All Jobs</h2>

            <span>
              {jobs.length} jobs
            </span>
          </div>

          {jobs.length === 0 ? (
            <div className="empty-jobs">
              No jobs found.
            </div>
          ) : (
            <div className="jobs-table-container">

              <table className="jobs-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Employment Type</th>
                    <th>Salary</th>
                    <th>Experience</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id}>

                      <td>
                        {job.id}
                      </td>

                      <td>
                        <strong>
                          {job.title}
                        </strong>
                      </td>

                      <td>
                        {job.companyName || 'N/A'}
                      </td>

                      <td>
                        {job.jobLocation || 'N/A'}
                      </td>

                      <td>
                        {job.employmentType || 'N/A'}
                      </td>

                      <td>
                        {job.salary !== null &&
                        job.salary !== undefined
                          ? `₹${job.salary}`
                          : 'N/A'}
                      </td>

                      <td>
                        {job.experience !== null &&
                        job.experience !== undefined
                          ? `${job.experience} years`
                          : 'N/A'}
                      </td>

                      <td>
                        <button
                          className="delete-job-button"
                          onClick={() =>
                            handleDelete(job.id)
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

export default ManageJobs