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

  const [emailRec, setEmailRec] = useState('');

  function handleGoogleResponse(response) {
    const user = jwtDecode(response.credential);
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
      if (response.length != 0) {
        console.log('Login successful');
        setEmail('');
        setPassword('');
        setFailed(false);
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


  const handleEmailRecChange = (e) => {
    setEmailRec(e.target.value);
  };

  const handleForgotPass = async (event) => {
    event.preventDefault();
    try {
      const response = await fetchData(
        `/user/forgotPassword?email=${emailRec}`
      );
      if (response === 'Email sent') {
        setEmailRec('');
        document.getElementById('modal-1').close();
      } else {
        console.error('Send failed');
      }
    } catch (error) {
      console.error('Error during API call', error);
    }
  }

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
                <button className='mt-3 mb-3' onClick={()=>document.getElementById('modal-1').showModal()}>Forgot your password?</button>
                <GoogleLogin onSuccess={handleGoogleResponse} />
              </div>
            </form>
          </div>
        </div>
        <dialog id="modal-1" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Forgot your password?</h3>  
            <input
              type="email"
              placeholder="email"
              className="input input-bordered mt-3 w-full"
              required
              onChange={handleEmailRecChange}
            />
            <div className="modal-action">
              <form method="dialog">
                <button
                  className="btn btn-primary mr-2"
                  onClick={handleForgotPass}
                >
                  Send
                </button>
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
       
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
