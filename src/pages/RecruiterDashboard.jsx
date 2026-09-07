import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './RecruiterDashboard.css'

function RecruiterDashboard() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        navigate('/')
        return
      }

      const response = await fetch(
        'http://localhost:8086/api/users/me',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      console.log('RECRUITER USER:', data)

      if (response.ok && (data.success || data.sucess)) {
        setUser(data.data)
      } else {
        navigate('/')
      }
    } catch (error) {
      console.error('FETCH USER ERROR:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  if (loading) {
    return (
      <div className="recruiter-dashboard">
        <div className="dashboard-loading">
          Loading dashboard...
        </div>
      </div>
    )
  }

  return (
    <div className="recruiter-dashboard">

      <header className="recruiter-header">

        <div>
          <h1>Recruiter Dashboard</h1>

          <p>
            Welcome, {user?.firstName} {user?.lastName}
          </p>
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </header>

      <main className="recruiter-content">

        <div className="recruiter-welcome">
          <h2>Manage Your Recruitment</h2>

          <p>
            Create jobs, manage your job postings and review
            applications from candidates.
          </p>
        </div>

        <div className="recruiter-cards">

          <div
            className="recruiter-card"
            onClick={() => navigate('/create-job')}
          >
            <div className="card-icon">＋</div>

            <h3>Create Job</h3>

            <p>
              Post a new job opportunity and find qualified
              candidates.
            </p>

            <button>
              Create Job
            </button>
          </div>

          <div
            className="recruiter-card"
            onClick={() => navigate('/recruiter/jobs')}
          >
            <div className="card-icon">▣</div>

            <h3>My Jobs</h3>

            <p>
              View, edit and delete your existing job postings.
            </p>

            <button>
              View Jobs
            </button>
          </div>

          <div
            className="recruiter-card"
            onClick={() => navigate('/profile')}
          >
            <div className="card-icon">◉</div>

            <h3>My Profile</h3>

            <p>
              View and update your recruiter profile information.
            </p>

            <button>
              View Profile
            </button>
          </div>

        </div>

      </main>

    </div>
  )
}

export default RecruiterDashboard