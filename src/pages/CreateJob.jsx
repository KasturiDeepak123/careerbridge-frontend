import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateJob.css'

function CreateJob() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    jobDescription: '',
    jobLocation: '',
    salary: '',
    experience: '',
    employmentType: ''
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setMessage('')
    setError('')

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
      setLoading(true)

      const token = localStorage.getItem('token')

      if (!token) {
        setError('Please login again')
        navigate('/')
        return
      }

      const response = await fetch(
        'https://careerbridge-backend-7jme.onrender.com/api/jobs/create',
        {
          method: 'POST',
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

      console.log('CREATE JOB RESPONSE:', data)

      if (response.ok && (data.success || data.sucess)) {
        setMessage('Job created successfully!')

        setFormData({
          title: '',
          jobDescription: '',
          jobLocation: '',
          salary: '',
          experience: '',
          employmentType: ''
        })
      } else {
        setError(data.message || 'Failed to create job')
      }
    } catch (error) {
      console.error('CREATE JOB ERROR:', error)
      setError('Unable to connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-job-page">

      <div className="create-job-card">

        <div className="create-job-header">
          <button
            className="back-button"
           onClick={() => navigate('/dashboard')}
          >
            ← Back
          </button>

          <h1>Create New Job</h1>
          <p>Post a new job opportunity on CareerBridge</p>
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

        <form onSubmit={handleSubmit} className="create-job-form">

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
                placeholder="Example: 800000"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Experience</label>

              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Example: 2"
                min="0"
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
            className="create-job-button"
            disabled={loading}
          >
            {loading ? 'Creating Job...' : 'Create Job'}
          </button>

        </form>

      </div>

    </div>
  )
}

export default CreateJob