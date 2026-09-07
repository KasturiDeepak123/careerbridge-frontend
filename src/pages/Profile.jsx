
import React, { useState, useEffect } from 'react'
import './Profile.css'

function Profile() {

  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [resumeFile, setResumeFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [company, setCompany] = useState(null)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: ''
  })

  // =========================
  // GET CURRENT USER
  // =========================
  useEffect(() => {

    const fetchUserData = async () => {

      try {

        const token = localStorage.getItem('token')

        const response = await fetch(
          'https://careerbridge-backend-7jme.onrender.com/api/users/me',
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )

        const data = await response.json()

        console.log('PROFILE RESPONSE:', data)

        if (data.success || data.sucess) {

          setUser(data.data)

          setFormData({
            firstName: data.data.firstName || '',
            lastName: data.data.lastName || '',
            phoneNumber: data.data.phoneNumber || ''
          })

        } else {

          console.log('FAILED TO FETCH PROFILE:', data.message)

        }

      } catch (error) {

        console.error('PROFILE ERROR:', error)

      }

    }

    fetchUserData()

  }, [])


  // =========================
  // GET RECRUITER COMPANY
  // =========================
  useEffect(() => {

    if (!user || user.role !== 'RECRUITER') {
      return
    }

    const fetchCompany = async () => {

      try {

        const token = localStorage.getItem('token')

        const response = await fetch(
          'https://careerbridge-backend-7jme.onrender.com/api/companies',
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )

        const data = await response.json()

        console.log('COMPANY RESPONSE:', data)

        if (data.success || data.sucess) {

          const recruiterCompany = data.data.find(
            company => company.companyEmail === user.email
          )

          setCompany(recruiterCompany || null)

        }

      } catch (error) {

        console.error('COMPANY PROFILE ERROR:', error)

      }

    }

    fetchCompany()

  }, [user])


  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (event) => {

    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })

  }


  // =========================
  // SAVE PROFILE
  // =========================
  const handleSave = async () => {

    try {

      const token = localStorage.getItem('token')

      const response = await fetch(
        'https://careerbridge-backend-7jme.onrender.com/api/users/me',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        }
      )

      const data = await response.json()

      console.log('UPDATE PROFILE RESPONSE:', data)

      if (data.success || data.sucess) {

        setUser({
          ...user,
          firstName: data.data.firstName,
          lastName: data.data.lastName,
          phoneNumber: data.data.phoneNumber
        })

        setFormData({
          firstName: data.data.firstName,
          lastName: data.data.lastName,
          phoneNumber: data.data.phoneNumber
        })

        // Update navbar user information
        const storedUser = localStorage.getItem('user')

        if (storedUser) {

          const navbarUser = JSON.parse(storedUser)

          localStorage.setItem(
            'user',
            JSON.stringify({
              ...navbarUser,
              firstName: data.data.firstName,
              lastName: data.data.lastName
            })
          )

        }

        setIsEditing(false)

        alert('Profile updated successfully')

      } else {

        alert(data.message || 'Profile update failed')

      }

    } catch (error) {

      console.error('UPDATE PROFILE ERROR:', error)

      alert('Something went wrong while updating profile')

    }

  }


  // =========================
  // CANCEL EDIT
  // =========================
  const handleCancel = () => {

    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phoneNumber: user?.phoneNumber || ''
    })

    setIsEditing(false)

  }


  // =========================
  // SELECT RESUME
  // =========================
  const handleResumeChange = (event) => {

    const file = event.target.files[0]

    if (!file) {
      return
    }

    if (file.type !== 'application/pdf') {

      alert('Only PDF files are allowed')

      event.target.value = ''

      return
    }

    setResumeFile(file)

  }


  // =========================
  // UPLOAD RESUME
  // =========================
  const handleResumeUpload = async () => {

    if (!resumeFile) {

      alert('Please select a PDF resume first')

      return

    }

    try {

      setIsUploading(true)

      const token = localStorage.getItem('token')

      const uploadData = new FormData()

      uploadData.append('file', resumeFile)

      const response = await fetch(
        'http://localhost:8086/api/users/resume',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: uploadData
        }
      )

      const data = await response.json()

      console.log('RESUME UPLOAD RESPONSE:', data)

      if (data.success || data.sucess) {

        setUser({
          ...user,
          resumeUrl: data.data
        })

        setResumeFile(null)

        const fileInput = document.getElementById('resumeInput')

        if (fileInput) {
          fileInput.value = ''
        }

        alert('Resume uploaded successfully')

      } else {

        alert(data.message || 'Resume upload failed')

      }

    } catch (error) {

      console.error('RESUME UPLOAD ERROR:', error)

      alert('Something went wrong while uploading resume')

    } finally {

      setIsUploading(false)

    }

  }


  // =========================
  // LOADING
  // =========================
  if (!user) {

    return (
      <div className="profile-container">
        <h1>My Profile</h1>
        <p>Loading profile...</p>
      </div>
    )

  }


  return (

    <div className="profile-container">

      <div className="profile-page-header">
        <div>
          <h1>My Profile</h1>
          <p>Manage your personal account information.</p>
        </div>
      </div>

      <div className="profile-card">

        {/* ================= HEADER ================= */}

        <div className="profile-header">

          <div className="profile-avatar">
            {user.firstName?.charAt(0)}
            {user.lastName?.charAt(0)}
          </div>

          <div>
            <h2>
              {user.firstName} {user.lastName}
            </h2>

            <span className="profile-role">
              {user.role}
            </span>
          </div>

        </div>


        {/* ================= PERSONAL INFORMATION ================= */}

        {isEditing ? (

          <div className="profile-section">

            <h3>Personal Information</h3>

            <div className="profile-form-grid">

              <div className="profile-field">
                <label>First Name</label>

                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                />
              </div>

              <div className="profile-field">
                <label>Last Name</label>

                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                />
              </div>

              <div className="profile-field">
                <label>Email Address</label>

                <input
                  type="email"
                  value={user.email || ''}
                  disabled
                />
              </div>

              <div className="profile-field">
                <label>Phone Number</label>

                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone Number"
                />
              </div>

            </div>

          </div>

        ) : (

          <div className="profile-section">

            <h3>Personal Information</h3>

            <div className="profile-info-grid">

              <div className="profile-info-item">
                <span>First Name</span>
                <strong>{user.firstName}</strong>
              </div>

              <div className="profile-info-item">
                <span>Last Name</span>
                <strong>{user.lastName}</strong>
              </div>

              <div className="profile-info-item">
                <span>Email Address</span>
                <strong>{user.email}</strong>
              </div>

              <div className="profile-info-item">
                <span>Phone Number</span>
                <strong>{user.phoneNumber}</strong>
              </div>

            </div>

          </div>

        )}


        {/* ================= RECRUITER COMPANY ================= */}

        {user.role === 'RECRUITER' && (

          <div className="profile-section">

            <h3>Company Information</h3>

            {company ? (

              <div className="profile-info-grid">

                <div className="profile-info-item">
                  <span>Company Name</span>
                  <strong>{company.companyName}</strong>
                </div>

                <div className="profile-info-item">
                  <span>Company Email</span>
                  <strong>{company.companyEmail}</strong>
                </div>

                <div className="profile-info-item">
                  <span>Industry</span>
                  <strong>{company.industry}</strong>
                </div>

                <div className="profile-info-item">
                  <span>Location</span>
                  <strong>{company.location}</strong>
                </div>

                <div className="profile-info-item">
                  <span>Phone</span>
                  <strong>{company.companyPhone}</strong>
                </div>

                <div className="profile-info-item">
                  <span>Website</span>

                  {company.website ? (

                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {company.website}
                    </a>

                  ) : (
                    <strong>Not provided</strong>
                  )}

                </div>

                <div className="profile-description">
                  <span>Description</span>
                  <p>{company.description}</p>
                </div>

              </div>

            ) : (

              <div className="company-empty">
                <p>No company information found.</p>
              </div>

            )}

          </div>

        )}


        {/* ================= JOB SEEKER RESUME ================= */}

        {user.role === 'JOB_SEEKER' && (

          <div className="profile-section">

            <h3>Documents</h3>

            {user.resumeUrl ? (

              <div className="resume-info">

                <div className="resume-file">

                  <span className="resume-icon">PDF</span>

                  <div>
                    <strong>Resume</strong>
                    <p>Your uploaded resume</p>
                  </div>

                  <a
                    className="view-resume-button"
                    href={`http://localhost:8086${user.resumeUrl}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Resume
                  </a>

                </div>

              </div>

            ) : (

              <div className="resume-empty">
                <p>No resume uploaded yet.</p>
              </div>

            )}

            <div className="resume-upload">

              <input
                id="resumeInput"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleResumeChange}
              />

              <button
                className="upload-resume-button"
                onClick={handleResumeUpload}
                disabled={isUploading}
              >
                {isUploading
                  ? 'Uploading...'
                  : user.resumeUrl
                    ? 'Replace Resume'
                    : 'Upload Resume'
                }
              </button>

            </div>

            {resumeFile && (

              <p className="selected-file">
                Selected file: <strong>{resumeFile.name}</strong>
              </p>

            )}

          </div>

        )}


        {/* ================= BUTTONS ================= */}

        {isEditing ? (

          <div className="edit-buttons">

            <button
              className="save-button"
              onClick={handleSave}
            >
              Save Changes
            </button>

            <button
              className="cancel-button"
              onClick={handleCancel}
            >
              Cancel
            </button>

          </div>

        ) : (

          <button
            className="edit-button"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>

        )}

      </div>

    </div>

  )

}

export default Profile