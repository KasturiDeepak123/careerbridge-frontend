import React from 'react'

function Jobs() {
  const jobs = [
    {
      id: 1,
      title: 'Java Developer',
      company: 'ABC Technologies',
      location: 'Hyderabad',
      employmentType: 'Full Time',
      experience: 2
    },
    {
      id: 2,
      title: 'React Developer',
      company: 'XYZ Solutions',
      location: 'Bangalore',
      employmentType: 'Full Time',
      experience: 1
    }
  ]

  return (
    <>
      <h1>CareerBridge</h1>

      <h2>Find your next opportunity</h2>

      <input
        type="text"
        placeholder="Search jobs..."
      />

      <input
        type="text"
        placeholder="Location"
      />

      <button>Search</button>

      <h2>Available Jobs</h2>

      {jobs.map((job) => (
        <div key={job.id}>
          <h3>{job.title}</h3>
          <p>{job.company}</p>
          <p>{job.location}</p>
          <p>{job.employmentType}</p>
          <p>{job.experience} years experience</p>

          <button>View Details</button>
        </div>
      ))}
    </>
  )
}

export default Jobs