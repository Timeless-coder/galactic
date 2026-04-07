import { Routes, Route } from 'react-router'

import AuthPage from './pages/AuthPage/AuthPage'
import ToursPage from './pages/ToursPage/ToursPage'
import TourSinglePage from './pages/TourSinglePage/TourSinglePage'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import HomePage from './pages/HomePage/HomePage'
import CartPage from './pages/CartPage/CartPage'
import CheckoutPage from './pages/CheckoutPage/CheckoutPage'
import StripeSuccessPage from './pages/StripeSuccessPage/StripeSuccessPage'
import PrivateRoute from './routeHandlers/PrivateRoute'

import './index.scss' // only for parent container
import UserPage from './pages/UserPage/UserPage'
import NotFound from './pages/NotFound/NotFound'
import Works from './pages/WorksPage/WorksPage'

function App() {

  return (
    <div className="App">
      <Header />
      <div className='content-container'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/works' element={<Works />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path='/tours' element={<ToursPage />} />
          <Route path='/tours/:slug' element={<TourSinglePage />} />
          
          <Route path='/checkout-success' element={<StripeSuccessPage />} />
          
          <Route path='/account/:userId' element={<PrivateRoute component={UserPage} />} />
          <Route path='/account/:userId/cart' element={<PrivateRoute component={CartPage} />} />
          <Route path='/account/:userId/checkout' element={<PrivateRoute component={CheckoutPage} />} />

          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App