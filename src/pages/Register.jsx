
import React, { useState } from 'react'
import './Register.css'
import { useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'JOB_SEEKER'
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  const handleRegister = async (event) => {
    event.preventDefault()

    setMessage('')
    setError('')

    try {
      setLoading(true)

      const response = await fetch(
        'https://careerbridge-backend-7jme.onrender.com/api/users/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      )

      const data = await response.json()

      console.log('REGISTER RESPONSE:', data)

      if (response.ok && (data.success || data.sucess)) {
        setMessage('Registration successful!')

        setTimeout(() => {
          navigate('/')
        }, 1000)
      } else {
        setError(data.message || 'Registration failed')
      }
    } catch (error) {
      console.error('REGISTER ERROR:', error)
      setError('Unable to connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page">

      <div className="register-wrapper">

        <div className="register-brand">
          <div className="register-logo">
            C
          </div>

          <h1>CareerBridge</h1>

          <p>
            Build your career. Find your opportunity.
          </p>
        </div>

        <div className="register-card">

          <div className="register-header">
            <h2>Create Account</h2>
            <p>Join CareerBridge and take the next step in your career.</p>
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

          <form onSubmit={handleRegister}>

            <div className="form-row">

              <div className="form-group">
                <label>First Name</label>

                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>

                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  required
                />
              </div>

            </div>

            <div className="form-group">
              <label>Email Address</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>

              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter 10 digit phone number"
                required
              />
            </div>

            <div className="form-group">
              <label>Register As</label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="JOB_SEEKER">
                  Job Seeker
                </option>

                <option value="RECRUITER">
                  Recruiter
                </option>
              </select>
            </div>

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

          </form>

          <div className="login-link">
            <span>Already have an account?</span>

            <button onClick={() => navigate('/')}>
              Login
            </button>
          </div>

        </div>

      </div>

    </div>
  )
}

export default Register

