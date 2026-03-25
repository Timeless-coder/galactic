import { Routes, Route } from 'react-router'

import AuthPage from './pages/AuthPage/AuthPage'
import ToursPage from './pages/ToursPage/ToursPage'
import TourSinglePage from './pages/TourSinglePage/TourSinglePage'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import HomePage from './pages/HomePage/HomePage'
import CartPage from './pages/CartPage/CartPage'

import './index.scss' // only for parent container

function App() {

  return (
    <div className="App">
      <Header />
      <div className='content-container'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path='/tours' element={<ToursPage />} />
          <Route path='/tours/:slug' element={<TourSinglePage />} />
          <Route path='/cart' element={<CartPage/>} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
