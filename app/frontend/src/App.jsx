import { BrowserRouter, Route, Routes } from 'react-router-dom';
import StorePage from './components/pages/StorePage';
import HomePage from './components/pages/HomePage';
import ProductPage from './components/pages/ProductPage';
import LoginPage from './components/pages/LoginPage';
import RegisterUserPage from './components/pages/RegisterUserPage';
import UserPage from './components/pages/UserPage';
import CartPage from './components/pages/CartPage';
import CheckoutPage from './components/pages/CheckoutPage'; 

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />
        <Route
          path="/store"
          element={<StorePage />}
        />
        <Route
          path="/store/product/:id"
          element={<ProductPage />}
        />
        <Route
          path="/login"
          element={<LoginPage />}
        />
        <Route
          path="/registerUser"
          element={<RegisterUserPage />}
        />
        <Route
          path="/user"
          element={<UserPage />}
        />
        <Route
          path="/user/cart"
          element={<CartPage />}
        />
        <Route
          path="/user/checkout"
          element={<CheckoutPage />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
