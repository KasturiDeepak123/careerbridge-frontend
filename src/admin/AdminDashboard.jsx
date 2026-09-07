import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminDashboard.css'

function AdminDashboard() {
  const navigate = useNavigate()

  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      setError('')

      const token = localStorage.getItem('token')

      if (!token) {
        navigate('/')
        return
      }

      const response = await fetch(
        'https://careerbridge-backend-7jme.onrender.com/api/admin/dashboard',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (response.ok && (data.success || data.sucess)) {
        setDashboard(data.data)
      } else {
        setError(data.message || 'Failed to load admin dashboard')
      }
    } catch (error) {
      console.error('ADMIN DASHBOARD ERROR:', error)
      setError('Unable to connect to server')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <div className="admin-status">
          Loading admin dashboard...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="admin-dashboard-page">
        <div className="admin-error">
          {error}
        </div>

        <button
          className="admin-retry-button"
          onClick={fetchDashboard}
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="admin-dashboard-page">
      <header className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage CareerBridge from one place</p>
        </div>

        <button
          className="admin-logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <main className="admin-dashboard-content">
        <section className="admin-stats-grid">

          <div className="admin-stat-card">
            <div className="admin-stat-icon">👥</div>
            <div>
              <h3>Total Users</h3>
              <strong>{dashboard?.totalUsers ?? 0}</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">🔍</div>
            <div>
              <h3>Job Seekers</h3>
              <strong>{dashboard?.totalJobSeekers ?? 0}</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">💼</div>
            <div>
              <h3>Recruiters</h3>
              <strong>{dashboard?.totalRecruiters ?? 0}</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">🛡️</div>
            <div>
              <h3>Admins</h3>
              <strong>{dashboard?.totalAdmins ?? 0}</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">🏢</div>
            <div>
              <h3>Companies</h3>
              <strong>{dashboard?.totalCompanies ?? 0}</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">📋</div>
            <div>
              <h3>Total Jobs</h3>
              <strong>{dashboard?.totalJobs ?? 0}</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">📨</div>
            <div>
              <h3>Applications</h3>
              <strong>{dashboard?.totalApplications ?? 0}</strong>
            </div>
          </div>

        </section>

        <section className="admin-management-section">

          <div className="admin-section-header">
            <h2>Management</h2>
            <p>Manage users, companies, jobs and applications</p>
          </div>

          <div className="admin-management-grid">

            <div className="admin-management-card">
              <div className="management-icon">👥</div>
              <h3>Manage Users</h3>
              <p>
                View users, change their roles and delete accounts.
              </p>
              <button onClick={() => navigate('/admin/users')}>
                Manage Users
              </button>
            </div>

            <div className="admin-management-card">
              <div className="management-icon">🏢</div>
              <h3>Manage Companies</h3>
              <p>
                View, edit and manage registered companies.
              </p>
              <button onClick={() => navigate('/admin/companies')}>
                Manage Companies
              </button>
            </div>

            <div className="admin-management-card">
              <div className="management-icon">💼</div>
              <h3>Manage Jobs</h3>
              <p>
                View all job postings and remove inappropriate jobs.
              </p>
              <button onClick={() => navigate('/admin/jobs')}>
                Manage Jobs
              </button>
            </div>

            <div className="admin-management-card">
              <div className="management-icon">📨</div>
              <h3>Manage Applications</h3>
              <p>
                View applications submitted by job seekers.
              </p>
              <button onClick={() => navigate('/admin/applications')}>
                Manage Applications
              </button>
            </div>

          </div>

        </section>
      </main>
    </div>
  )
}

export default AdminDashboard