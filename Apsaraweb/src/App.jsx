import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Header from './Components/Header';
import Footer from './Components/Footer';
import ProductsListing from './Pages/ProductsListing';
import ProductDetails from './Pages/ProductDetails';
import ScrollToTop from './Components/ScrollToTop';
import ShopPage from './Components/ShopPage';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import Contact from './Pages/Contact';
import Blog from './Pages/Blog';
import Training from './Pages/Training';
import About from './Pages/About';
import Login from './Components/Login';
import WhatsAppButton from './Components/WhatsappButton';
import { ToastContainer } from 'react-toastify';
import TrackingOrder from './Pages/TrackingOrder';

const App = () => {
  return (
    <div>
      <ToastContainer hideProgressBar autoClose={1500} theme="colored" position="top-center" />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<ShopPage />} />
        {/* Show products for a category */}
        <Route path="/products/:categoryId" element={<ProductsListing />} />
        {/* Show single product details */}
        <Route path="/product-details/:productId" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/training" element={<Training />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tracking" element={<TrackingOrder />} />
      </Routes>
      <Footer />
      <ScrollToTop />
      <WhatsAppButton />
    </div>
  );
};

export default App;
