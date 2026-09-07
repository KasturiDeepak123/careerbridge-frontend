import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token')

        if (!token) {
          navigate('/')
          return
        }

        const response = await fetch(
          'https://careerbridge-backend-7jme.onrender.com/api/users/me',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (!response.ok) {
          localStorage.removeItem('token')
          navigate('/')
          return
        }

        const data = await response.json()

        if (data.success || data.sucess) {
          setUser(data.data)
        } else {
          localStorage.removeItem('token')
          navigate('/')
        }
      } catch (error) {
        console.error('FETCH USER ERROR:', error)
        localStorage.removeItem('token')
        navigate('/')
      } finally {
        setLoading(false)
      }
    }

    fetchCurrentUser()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-loading">
          Loading dashboard...
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const role = user.role

  return (
    <div className="dashboard-container">

      <div className="dashboard-header">
        <div>
          <h1>CareerBridge</h1>
          <p>
            Welcome, {user.firstName} {user.lastName}
          </p>
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <div className="dashboard-welcome">
        <h2>
          {role === 'JOB_SEEKER'
            ? 'Job Seeker Dashboard'
            : role === 'RECRUITER'
              ? 'Recruiter Dashboard'
              : 'Admin Dashboard'}
        </h2>

        <span className="role-badge">
          {role}
        </span>
      </div>

      {/* JOB SEEKER */}

      {role === 'JOB_SEEKER' && (
        <div className="dashboard-grid">

          <div className="dashboard-card">
            <div className="dashboard-icon">🔎</div>

            <h3>Find Jobs</h3>

            <p>
              Search and explore available job opportunities.
            </p>

            <button
              onClick={() => navigate('/jobs')}
            >
              Browse Jobs
            </button>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-icon">📄</div>

            <h3>My Applications</h3>

            <p>
              Track your job applications and their status.
            </p>

            <button
              onClick={() => navigate('/applications')}
            >
              View Applications
            </button>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-icon">👤</div>

            <h3>My Profile</h3>

            <p>
              Update your personal information and resume.
            </p>

            <button
              onClick={() => navigate('/profile')}
            >
              View Profile
            </button>
          </div>

        </div>
      )}

      {/* RECRUITER */}

      {role === 'RECRUITER' && (
        <div className="dashboard-grid">

          <div className="dashboard-card">
            <div className="dashboard-icon">➕</div>

            <h3>Create Job</h3>

            <p>
              Post a new job opportunity for job seekers.
            </p>

            <button
              onClick={() => navigate('/create-job')}
            >
              Create Job
            </button>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-icon">💼</div>

            <h3>My Jobs</h3>

            <p>
              Manage the jobs posted by your company.
            </p>

            <button
              onClick={() => navigate('/recruiter/jobs')}
            >
              Manage Jobs
            </button>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-icon">👥</div>

            <h3>Applicants</h3>

            <p>
              View applicants and manage application statuses.
            </p>

            <button
              onClick={() => navigate('/recruiter/jobs')}
            >
              View Applicants
            </button>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-icon">👤</div>

            <h3>My Profile</h3>

            <p>
              Manage your recruiter profile information.
            </p>

            <button
              onClick={() => navigate('/profile')}
            >
              View Profile
            </button>
          </div>

        </div>
      )}

      {/* ADMIN */}

      {role === 'ADMIN' && (
        <div className="dashboard-grid">

          <div className="dashboard-card">
            <div className="dashboard-icon">📊</div>

            <h3>Admin Dashboard</h3>

            <p>
              View CareerBridge platform statistics.
            </p>

            <button
              onClick={() => navigate('/admin')}
            >
              Open Dashboard
            </button>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-icon">👥</div>

            <h3>Manage Users</h3>

            <p>
              View, delete and manage user accounts.
            </p>

            <button
              onClick={() => navigate('/admin/users')}
            >
              Manage Users
            </button>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-icon">🏢</div>

            <h3>Manage Companies</h3>

            <p>
              Manage registered companies.
            </p>

            <button
              onClick={() => navigate('/admin/companies')}
            >
              Manage Companies
            </button>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-icon">💼</div>

            <h3>Manage Jobs</h3>

            <p>
              View and manage all jobs on the platform.
            </p>

            <button
              onClick={() => navigate('/admin/jobs')}
            >
              Manage Jobs
            </button>
          </div>

        </div>
      )}

    </div>
  )
}

export default Dashboard