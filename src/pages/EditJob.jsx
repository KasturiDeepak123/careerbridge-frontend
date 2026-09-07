import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './EditJob.css'

function EditJob() {
  const { jobId } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    jobDescription: '',
    jobLocation: '',
    salary: '',
    experience: '',
    employmentType: ''
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchJob()
  }, [jobId])

  const fetchJob = async () => {
    try {
      setLoading(true)
      setError('')

      const token = localStorage.getItem('token')

      if (!token) {
        navigate('/')
        return
      }

      const response = await fetch(
        `https://careerbridge-backend-7jme.onrender.com/api/jobs/${jobId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      console.log('EDIT JOB RESPONSE:', data)

      if (!response.ok || !(data.success || data.sucess)) {
        throw new Error(
          data.message || 'Failed to load job'
        )
      }

      const job = data.data

      setFormData({
        title: job.title || '',
        jobDescription: job.jobDescription || '',
        jobLocation: job.jobLocation || '',
        salary: job.salary || '',
        experience: job.experience || '',
        employmentType: job.employmentType || ''
      })

    } catch (error) {
      console.error('FETCH JOB ERROR:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setMessage('')

    if (
      !formData.title.trim() ||
      !formData.jobDescription.trim() ||
      !formData.jobLocation.trim() ||
      !formData.salary ||
      !formData.experience ||
      !formData.employmentType
    ) {
      setError('Please fill all fields')
      return
    }

    try {
      setSaving(true)

      const token = localStorage.getItem('token')

      if (!token) {
        navigate('/')
        return
      }

      const response = await fetch(
        `https://careerbridge-backend-7jme.onrender.com/api/jobs/${jobId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            title: formData.title,
            jobDescription: formData.jobDescription,
            jobLocation: formData.jobLocation,
            salary: Number(formData.salary),
            experience: Number(formData.experience),
            employmentType: formData.employmentType
          })
        }
      )

      const data = await response.json()

      console.log('UPDATE JOB RESPONSE:', data)

      if (!response.ok || !(data.success || data.sucess)) {
        throw new Error(
          data.message || 'Failed to update job'
        )
      }

      setMessage('Job updated successfully!')

      setTimeout(() => {
        navigate('/recruiter/jobs')
      }, 1000)

    } catch (error) {
      console.error('UPDATE JOB ERROR:', error)
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="edit-job-page">
        <div className="edit-job-loading">
          Loading job...
        </div>
      </div>
    )
  }

  return (
    <div className="edit-job-page">

      <div className="edit-job-card">

        <div className="edit-job-header">

          <button
            className="back-button"
            onClick={() => navigate('/recruiter/jobs')}
          >
            ← Back to My Jobs
          </button>

          <h1>Edit Job</h1>

          <p>
            Update your job posting details
          </p>

        </div>

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="edit-job-form"
        >

          <div className="form-group">

            <label>Job Title</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: Java Developer"
            />

          </div>

          <div className="form-group">

            <label>Job Description</label>

            <textarea
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              placeholder="Enter the job description..."
              rows="6"
            />

          </div>

          <div className="form-group">

            <label>Job Location</label>

            <input
              type="text"
              name="jobLocation"
              value={formData.jobLocation}
              onChange={handleChange}
              placeholder="Example: Hyderabad"
            />

          </div>

          <div className="form-row">

            <div className="form-group">

              <label>Salary</label>

              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                min="0"
                placeholder="Example: 800000"
              />

            </div>

            <div className="form-group">

              <label>Experience</label>

              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                min="0"
                placeholder="Example: 2"
              />

            </div>

          </div>

          <div className="form-group">

            <label>Employment Type</label>

            <select
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
            >

              <option value="">
                Select employment type
              </option>

              <option value="FULL_TIME">
                Full Time
              </option>

              <option value="PART_TIME">
                Part Time
              </option>

              <option value="CONTRACT">
                Contract
              </option>

              <option value="INTERNSHIP">
                Internship
              </option>

            </select>

          </div>

          <button
            type="submit"
            className="update-job-button"
            disabled={saving}
          >
            {saving ? 'Updating Job...' : 'Update Job'}
          </button>

        </form>

      </div>

    </div>
  )
}

export default EditJob