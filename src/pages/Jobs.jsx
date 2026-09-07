import React, { useEffect, useState } from 'react'
import './Jobs.css'
import JobCard from '../components/JobCard'

function Jobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState(0)
  const [size] = useState(10)

  const [searchData, setSearchData] = useState({
    title: '',
    jobLocation: '',
    employmentType: '',
    experience: ''
  })

  const [isSearching, setIsSearching] = useState(false)

  const fetchJobs = async (pageNumber = 0) => {
    try {
      setLoading(true)

      const token = localStorage.getItem('token')

      const response = await fetch(
        `https://careerbridge-backend-7jme.onrender.com/api/jobs?page=${pageNumber}&size=${size}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      console.log('JOBS RESPONSE:', data)

      if (data.success || data.sucess) {
        setJobs(data.data || [])
      } else {
        setJobs([])
      }
    } catch (error) {
      console.error('FETCH JOBS ERROR:', error)
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  const searchJobs = async (pageNumber = 0) => {
    try {
      setLoading(true)

      const token = localStorage.getItem('token')

      const params = new URLSearchParams()

      if (searchData.title.trim() !== '') {
        params.append(
          'title',
          searchData.title.trim()
        )
      }

      if (searchData.jobLocation.trim() !== '') {
        params.append(
          'jobLocation',
          searchData.jobLocation.trim()
        )
      }

      if (searchData.employmentType !== '') {
        params.append(
          'employmentType',
          searchData.employmentType
        )
      }

      if (searchData.experience !== '') {
        params.append(
          'experience',
          searchData.experience
        )
      }

      params.append('page', pageNumber)
      params.append('size', size)

      const response = await fetch(
        `https://careerbridge-backend-7jme.onrender.com/api/jobs/search?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      console.log('SEARCH RESPONSE:', data)

      if (data.success || data.sucess) {
        setJobs(data.data || [])
      } else {
        setJobs([])
      }
    } catch (error) {
      console.error('SEARCH ERROR:', error)
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (event) => {
    setSearchData({
      ...searchData,
      [event.target.name]: event.target.value
    })
  }

  const handleSearch = (event) => {
    event.preventDefault()

    setPage(0)
    setIsSearching(true)

    searchJobs(0)
  }

  const handleClear = () => {
    setSearchData({
      title: '',
      jobLocation: '',
      employmentType: '',
      experience: ''
    })

    setPage(0)
    setIsSearching(false)

    fetchJobs(0)
  }

  const handlePrevious = () => {
    if (page === 0) {
      return
    }

    const previousPage = page - 1

    setPage(previousPage)

    if (isSearching) {
      searchJobs(previousPage)
    } else {
      fetchJobs(previousPage)
    }
  }

  const handleNext = () => {
    const nextPage = page + 1

    if (jobs.length < size) {
      return
    }

    setPage(nextPage)

    if (isSearching) {
      searchJobs(nextPage)
    } else {
      fetchJobs(nextPage)
    }
  }

  useEffect(() => {
    fetchJobs(0)
  }, [])

  return (
    <div className="jobs-container">

      <h1>Find Your Next Job</h1>

      <form
        className="job-search"
        onSubmit={handleSearch}
      >

        <input
          type="text"
          name="title"
          value={searchData.title}
          onChange={handleChange}
          placeholder="Job title"
        />

        <input
          type="text"
          name="jobLocation"
          value={searchData.jobLocation}
          onChange={handleChange}
          placeholder="Location"
        />

        <select
          name="employmentType"
          value={searchData.employmentType}
          onChange={handleChange}
        >
          <option value="">
            All Employment Types
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

        <input
          type="number"
          name="experience"
          value={searchData.experience}
          onChange={handleChange}
          placeholder="Experience"
          min="0"
        />

        <button type="submit">
          Search
        </button>

        <button
          type="button"
          onClick={handleClear}
        >
          Clear
        </button>

      </form>

      {loading ? (
        <p className="jobs-message">
          Loading jobs...
        </p>
      ) : jobs.length === 0 ? (
        <p className="jobs-message">
          No jobs found.
        </p>
      ) : (
        <>
          <div className="jobs-list">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
              />
            ))}
          </div>

          <div className="pagination">

            <button
              onClick={handlePrevious}
              disabled={page === 0 || loading}
            >
              Previous
            </button>

            <span>
              Page {page + 1}
            </span>

            <button
              onClick={handleNext}
              disabled={jobs.length < size || loading}
            >
              Next
            </button>

          </div>
        </>
      )}

    </div>
  )
}

export default Jobs