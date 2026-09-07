
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('user')

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    }

    loadUser()
  }, [location.pathname])

  const closeMenu = () => {
    setMenuOpen(false)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    setUser(null)
    setMenuOpen(false)

    navigate('/')
  }

  // Hide navbar on authentication pages
  if (
    location.pathname === '/' ||
    location.pathname === '/register'
  ) {
    return null
  }

  if (!user) {
    return null
  }

  const role = user.role?.toUpperCase()

  const jobSeekerLinks = [
    {
      name: 'Jobs',
      path: '/jobs'
    },
    {
      name: 'My Applications',
      path: '/applications'
    },
    {
      name: 'Profile',
      path: '/profile'
    }
  ]

  const recruiterLinks = [
    {
      name: 'Dashboard',
      path: '/dashboard'
    },
    {
      name: 'My Jobs',
      path: '/recruiter/jobs'
    },
    {
      name: 'Create Job',
      path: '/create-job'
    },
    {
      name: 'Profile',
      path: '/profile'
    }
  ]

  const adminLinks = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard'
    },
    {
      name: 'Users',
      path: '/admin/users'
    },
    {
      name: 'Companies',
      path: '/admin/companies'
    },
    {
      name: 'Jobs',
      path: '/admin/jobs'
    },
    {
      name: 'Applications',
      path: '/admin/applications'
    }
  ]

  let links = []

  if (role === 'JOB_SEEKER') {
    links = jobSeekerLinks
  } else if (role === 'RECRUITER') {
    links = recruiterLinks
  } else if (role === 'ADMIN') {
    links = adminLinks
  }

  const getHomePath = () => {
    if (role === 'ADMIN') {
      return '/admin/dashboard'
    }

    return '/dashboard'
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link
          to={getHomePath()}
          className="navbar-logo"
          onClick={closeMenu}
        >
          <span className="logo-icon">
            C
          </span>

          <span>
            CareerBridge
          </span>
        </Link>

        <button
          className="navbar-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div
          className={`navbar-content ${
            menuOpen ? 'open' : ''
          }`}
        >

          <div className="navbar-links">

            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                className={`navbar-link ${
                  isActive(link.path)
                    ? 'active'
                    : ''
                }`}
              >
                {link.name}
              </Link>
            ))}

          </div>

          <div className="navbar-right">

            <div className="navbar-user">

              <div className="navbar-avatar">
                {user.firstName
                  ?.charAt(0)
                  ?.toUpperCase() || 'U'}
              </div>

              <div className="navbar-user-info">

                <span className="navbar-user-name">
                  {user.firstName || 'User'}
                </span>

                <span className="navbar-user-role">
                  {role?.replace('_', ' ') || 'USER'}
                </span>

              </div>

            </div>

            <button
              className="navbar-logout"
              onClick={logout}
            >
              Logout
            </button>

          </div>

        </div>

      </div>
    </nav>
  )
}

export default Navbar
