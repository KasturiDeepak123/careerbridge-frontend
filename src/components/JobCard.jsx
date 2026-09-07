import React from 'react'
import { useNavigate } from 'react-router-dom'
import './JobCard.css'

function JobCard({ job }) {
  const navigate = useNavigate()

  const handleViewDetails = () => {
    navigate(`/jobs/${job.id}`)
  }

  return (
    <div className="job-card">

      <h2>{job.title}</h2>

      <p>
        <strong>Company:</strong> {job.companyName}
      </p>

      <p>
        <strong>Location:</strong> {job.jobLocation}
      </p>

      <p>
        <strong>Employment Type:</strong> {job.employmentType}
      </p>

      <p>
        <strong>Experience:</strong> {job.experience}
      </p>

      <p>
        <strong>Salary:</strong> {job.salary}
      </p>

      <p>
        <strong>Description:</strong> {job.jobDescription}
      </p>

      <div className="job-buttons">

        <button onClick={handleViewDetails}>
          View Details
        </button>

        <button>
          Apply
        </button>

      </div>

    </div>
  )
}

export default JobCard