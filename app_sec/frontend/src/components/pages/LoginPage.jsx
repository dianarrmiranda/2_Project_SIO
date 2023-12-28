import { useEffect, useState } from 'react';
import Footer from '../layout/Footer';
import Navbar from '../layout/Navbar';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

import { RiEyeLine, RiEyeCloseLine } from 'react-icons/ri';
import { jwtDecode } from 'jwt-decode';
import  useAuth from '../../hooks/useAuth';

import { fetchData } from '../../utils';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [failed, setFailed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { setAuth } = useAuth();

  function handleGoogleResponse(response) {
    console.log('google response -> ', response.credential);
    const user = jwtDecode(response.credential);
    console.log('user -> ', user);
    const id = parseInt(user.sub);    
    
    setAuth({
      isAuthenticated: true,
      user: {
        id: id,
        email: user.email,
        name: user.name,
        image: user.picture,
        shopping_Cart: [],
        request_History: [],
      },
      acessToken: response.credential,
    });
    navigate('/');
  }

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetchData(
        `/user/checkLogin?email=${email}&password=${password}`
      );
      console.log('res - ', response);
      if (response.length != 0) {
        console.log('Login successful');
        setEmail('');
        setPassword('');
        setFailed(false);
        console.log('response -> ', response);
        setAuth({
          isAuthenticated: true,
          user: {
            id: response.id,
            email: response.email,
            name: response.name,
            image: response.image,
            shopping_Cart: response.shopping_Cart,
            request_History: response.request_History,
          },
          acessToken: response.token,
        });
        navigate('/');
      } else {
        console.error('Login failed');
        setFailed(true);
      }
    } catch (error) {
      console.error('Error during API call', error);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value.replace(/\s+/g, ' '));
  };

  return (
    <div>
      <Navbar />
      <div className="hero min-h-screen bg-[url('/src/assets/shopping2.jpg')]">
        <div className="flex-col items-center justify-center w-full hero-content lg:flex-row-reverse">
          <div className="p-2 text-center rounded-md bg:text-left bg-secondary bg-opacity-80">
            <h1 className="text-5xl font-bold">Login now!</h1>
            <p className="py-6">
              New here?{' '}
              <a
                href=""
                onClick={() => navigate('/registerUser')}
                className="link link-accent"
              >
                Sign up
              </a>{' '}
              for an account to get started.
            </p>
          </div>
          <div className="flex-shrink-0 w-full max-w-sm shadow-2xl card bg-base-100">
            <form className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="email"
                  className="input input-bordered"
                  required
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <div className="w-full join">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="password"
                    className="w-full input input-bordered join-item "
                    required
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  <button
                    type="button"
                    className="btn btn-bordered join-item"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <RiEyeCloseLine /> : <RiEyeLine />}
                  </button>
                </div>
              </div>
              <div className="flex mt-6 form-control justify-evenly">
                <button
                  className="btn btn-primary"
                  onClick={handleLogin}
                >
                  Login
                </button>
                <GoogleLogin onSuccess={handleGoogleResponse} />
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
