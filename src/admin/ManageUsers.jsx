import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ManageUsers.css'

function ManageUsers() {
  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(
        'https://careerbridge-backend-7jme.onrender.com/api/admin/users',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch users')
      }

      setUsers(data.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(
        `https://careerbridge-backend-7jme.onrender.com/api/admin/users/${userId}/role`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            role: newRole,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update role')
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? { ...user, role: newRole }
            : user
        )
      )

      alert('User role updated successfully')
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDelete = async (userId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this user?'
    )

    if (!confirmed) {
      return
    }

    try {
      const response = await fetch(
        `https://careerbridge-backend-7jme.onrender.com/api/admin/users/${userId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete user')
      }

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userId)
      )

      alert('User deleted successfully')
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="manage-users-page">

      <div className="manage-users-header">
        <div>
          <h1>Manage Users</h1>
          <p>View and manage all CareerBridge users</p>
        </div>

        <button
          className="back-button"
          onClick={() => navigate('/admin/dashboard')}
        >
          ← Back to Dashboard
        </button>
      </div>

      {loading && (
        <div className="users-message">
          Loading users...
        </div>
      )}

      {error && (
        <div className="users-error">
          <p>{error}</p>

          <button onClick={fetchUsers}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="users-card">

          <div className="users-card-header">
            <h2>All Users</h2>
            <span>
              {users.length} users
            </span>
          </div>

          {users.length === 0 ? (
            <div className="empty-users">
              No users found.
            </div>
          ) : (
            <div className="users-table-container">

              <table className="users-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>

                      <td>
                        {user.id}
                      </td>

                      <td>
                        <strong>
                          {user.firstName} {user.lastName}
                        </strong>
                      </td>

                      <td>
                        {user.email}
                      </td>

                      <td>
                        {user.phoneNumber}
                      </td>

                      <td>
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(
                              user.id,
                              e.target.value
                            )
                          }
                          className={`role-select ${user.role?.toLowerCase()}`}
                        >
                          <option value="JOB_SEEKER">
                            JOB SEEKER
                          </option>

                          <option value="RECRUITER">
                            RECRUITER
                          </option>

                          <option value="ADMIN">
                            ADMIN
                          </option>
                        </select>
                      </td>

                      <td>
                        <button
                          className="delete-user-button"
                          onClick={() =>
                            handleDelete(user.id)
                          }
                        >
                          Delete
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          )}

        </div>
      )}

    </div>
  )
}

export default ManageUsers