import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Specialties from './pages/Specialties'
import FindDoctor from './pages/FindDoctor'
import Patient from './pages/Patient'
import Blog from './pages/Blog'
import HealthPackages from './pages/HealthPackages'
import Careers from './pages/Careers'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/specialties" element={<Specialties />} />
          <Route path="/find-doctor" element={<FindDoctor />} />
          <Route path="/patient" element={<Patient />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/health-packages" element={<HealthPackages />} />
          <Route path="/careers" element={<Careers />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App 