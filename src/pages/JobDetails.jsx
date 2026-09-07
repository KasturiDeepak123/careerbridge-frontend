import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './JobDetails.css'

function JobDetails() {
    const { id } = useParams()
    const [job, setJob] = useState(null)
  const [message, setMessage] = useState('')

    const handleApply = async () => {
  const token = localStorage.getItem('token')

  const response = await fetch(
    `https://careerbridge-backend-7jme.onrender.com/api/job-applications/${id}/apply`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  )
  const data = await response.json()

 if (response.ok) {
    setMessage('Application submitted successfully!')
  } else {
    setMessage(data.message)
  }
}
  

  useEffect(() => {
    const fetchJob = async () => {
      const token = localStorage.getItem('token')

      const response = await fetch(
        `https://careerbridge-backend-7jme.onrender.com/api/jobs/${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      console.log('JOB DETAILS RESPONSE:', data)

      if (data.sucess) {
        setJob(data.data)
      }
    }

    fetchJob()
  }, [id])

  return (
  <div className="job-details-container">

    <div className="job-details-header">
      <h1>{job?.title}</h1>
      <h2>{job?.companyName}</h2>
      <p>{job?.jobLocation}</p>
    </div>

    <div className="job-info">
      <h3>Job Information</h3>

      <p>Salary: ₹{job?.salary}</p>
      <p>Experience: {job?.experience} years</p>
      <p>Employment Type: {job?.employmentType}</p>
      <p>Location: {job?.jobLocation}</p>
    </div>

    <div className="job-description">
      <h3>Job Description</h3>
      <p>{job?.jobDescription}</p>
    </div>

    <div className="company-section">
  <h3>About the Company</h3>

  <p>Company: {job?.companyName}</p>
  <p>Industry: {job?.industry}</p>
  <p>Location: {job?.companyLocation}</p>
  <p>Description: {job?.companyDescription}</p>

  {job?.website && (
    <p>
      Website:{' '}
      <a href={job.website} target="_blank" rel="noreferrer">
        Visit Company Website
      </a>
    </p>
  )}
</div>

    <button className="apply-button" onClick={handleApply}>
  Apply Now
</button>
{message && <p>{message}</p>}
  </div>
)
}

export default JobDetails