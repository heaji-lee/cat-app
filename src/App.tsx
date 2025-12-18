import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Nav from './components/Nav'
import Home from './pages/Home'
import Upload from './pages/Upload'
import Favourites from './pages/Favourites'
import Moo from './pages/Moo'

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <div className="shrink-0">
          <Nav />
        </div>

        <div className="flex-1 p-6 items-center text-center">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="/moo" element={<Moo />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App