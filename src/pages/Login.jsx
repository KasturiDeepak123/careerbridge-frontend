
import React, { useState } from 'react'
import './Login.css'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loginData = {
        email: email,
        password: password
      }

      const response = await fetch(
        'https://careerbridge-backend-7jme.onrender.com/api/users/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(loginData)
        }
      )

      const data = await response.json()

      console.log('LOGIN RESPONSE:', data)

      if (data.success || data.sucess) {
        localStorage.setItem(
          'token',
          data.data.token
        )

        const loggedInUser = {
          id: data.data.id,
          firstName: data.data.firstName,
          lastName: data.data.lastName,
          email: data.data.email,
          role: data.data.role
        }

        localStorage.setItem(
          'user',
          JSON.stringify(loggedInUser)
        )

        if (data.data.role === 'ADMIN') {
          navigate('/admin/dashboard')
        } else {
          navigate('/dashboard')
        }
      } else {
        alert(
          data.message ||
          'Invalid email or password'
        )
      }
    } catch (error) {
      console.error('LOGIN ERROR:', error)
      alert('Unable to connect to server')
    }
  }

  return (
    <div className="login-page">

      <div className="login-wrapper">

        <div className="login-brand">

          <div className="login-logo">
            C
          </div>

          <h1>CareerBridge</h1>

          <p>
            Connect with opportunities.
            Build your career.
          </p>

          <div className="login-brand-points">
            <div>
              <span>✓</span>
              Find the right opportunities
            </div>

            <div>
              <span>✓</span>
              Connect with leading companies
            </div>

            <div>
              <span>✓</span>
              Take the next step in your career
            </div>
          </div>

        </div>

        <div className="login-card">

          <div className="login-header">

            <h2>Welcome Back</h2>

            <p>
              Sign in to continue to CareerBridge.
            </p>

          </div>

          <form onSubmit={handleLogin}>

            <div className="login-form-group">

              <label>Email Address</label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                required
              />

            </div>

            <div className="login-form-group">

              <label>Password</label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                required
              />

            </div>

            <button
              type="submit"
              className="login-button"
            >
              Sign In
            </button>

          </form>

          <div className="register-link">

            <span>
              Don't have an account?
            </span>

            <button
              onClick={() =>
                navigate('/register')
              }
            >
              Create Account
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Login
