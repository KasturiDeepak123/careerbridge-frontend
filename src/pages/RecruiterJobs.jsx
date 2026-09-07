import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './RecruiterJobs.css'

function RecruiterJobs() {
  const navigate = useNavigate()

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMyJobs()
  }, [])

  const fetchMyJobs = async () => {
    try {
      setLoading(true)
      setError('')

      const token = localStorage.getItem('token')

      if (!token) {
        navigate('/')
        return
      }

      const response = await fetch(
        'http://localhost:8086/api/jobs/my-jobs',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      console.log('MY JOBS RESPONSE:', data)

      if (response.ok && (data.success || data.sucess)) {
        setJobs(data.data || [])
      } else {
        setError(data.message || 'Failed to load jobs')
      }
    } catch (error) {
      console.error('FETCH MY JOBS ERROR:', error)
      setError('Unable to connect to server')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this job?'
    )

    if (!confirmDelete) {
      return
    }

    try {
      const token = localStorage.getItem('token')

      const response = await fetch(
        `http://localhost:8086/api/jobs/${jobId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      console.log('DELETE JOB RESPONSE:', data)

      if (response.ok && (data.success || data.sucess)) {
        setJobs(
          jobs.filter((job) => job.id !== jobId)
        )
      } else {
        alert(data.message || 'Failed to delete job')
      }
    } catch (error) {
      console.error('DELETE JOB ERROR:', error)
      alert('Unable to connect to server')
    }
  }

  return (
    <div className="recruiter-jobs-page">

      <header className="recruiter-jobs-header">

        <div>
          <h1>My Jobs</h1>
          <p>Manage your job postings</p>
        </div>

        <div className="header-buttons">

          <button
            className="dashboard-button"
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </button>

          <button
            className="create-button"
            onClick={() => navigate('/create-job')}
          >
            + Create Job
          </button>

        </div>

      </header>

      <main className="recruiter-jobs-content">

        {loading && (
          <div className="jobs-status">
            Loading your jobs...
          </div>
        )}

        {!loading && error && (
          <div className="jobs-error">
            {error}
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="empty-jobs">

            <h2>No Jobs Posted Yet</h2>

            <p>
              You haven't created any job postings yet.
            </p>

            <button
              onClick={() => navigate('/create-job')}
            >
              Create Your First Job
            </button>

          </div>
        )}

        {!loading && !error && jobs.length > 0 && (

          <div className="jobs-grid">

            {jobs.map((job) => (

              <div
                className="recruiter-job-card"
                key={job.id}
              >

                <div className="job-card-top">

                  <div>
                    <h2>{job.title}</h2>

                    <p className="job-location">
                      📍 {job.jobLocation}
                    </p>
                  </div>

                  <span className="employment-badge">
                    {job.employmentType}
                  </span>

                </div>

                <div className="job-info">

                  <div>
                    <strong>Experience</strong>
                    <span>
                      {job.experience} years
                    </span>
                  </div>

                  <div>
                    <strong>Salary</strong>
                    <span>
                      ₹{job.salary}
                    </span>
                  </div>

                </div>

                <div className="job-description">

                  <strong>Description</strong>

                  <p>
                    {job.jobDescription}
                  </p>

                </div>

                <div className="job-actions">

                  <button
                    className="applicants-button"
                    onClick={() =>
                      navigate(
                        `/recruiter/jobs/${job.id}/applicants`
                      )
                    }
                  >
                    Applicants
                  </button>

                  <button
                    className="edit-button"
                    onClick={() =>
                      navigate(
                        `/recruiter/jobs/edit/${job.id}`
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() =>
                      handleDelete(job.id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  )
}

export default RecruiterJobs