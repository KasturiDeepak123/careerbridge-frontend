
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import Profile from './pages/Profile'
import JobDetails from './pages/JobDetails'
import MyApplications from './pages/MyApplications'
import CreateJob from './pages/CreateJob'
import EditJob from './pages/EditJob'
import RecruiterJobs from './pages/RecruiterJobs'
import RecruiterApplicants from './pages/RecruiterApplicants'

import AdminDashboard from './admin/AdminDashboard'
import ManageUsers from './admin/ManageUsers'
import ManageCompanies from './admin/ManageCompanies'
import ManageJobs from './admin/ManageJobs'
import ManageApplications from './admin/ManageApplications'

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/jobs" element={<Jobs />} />

        <Route path="/jobs/:id" element={<JobDetails />} />

        <Route path="/applications" element={<MyApplications />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/create-job" element={<CreateJob />} />

        <Route
          path="/recruiter/jobs"
          element={<RecruiterJobs />}
        />

        <Route
          path="/recruiter/jobs/edit/:jobId"
          element={<EditJob />}
        />

        <Route
          path="/recruiter/jobs/:jobId/applicants"
          element={<RecruiterApplicants />}
        />

        {/* Admin */}

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/users"
          element={<ManageUsers />}
        />

        <Route
          path="/admin/companies"
          element={<ManageCompanies />}
        />

        <Route
          path="/admin/jobs"
          element={<ManageJobs />}
        />

        <Route
          path="/admin/applications"
          element={<ManageApplications />}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App
