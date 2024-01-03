import { useState } from 'react';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { RiEyeCloseLine, RiEyeLine } from 'react-icons/ri';

import useSessionStorage from '../../hooks/useSessionStorage';

function RegisterUserPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setnewPassword] = useState('');
  const [image, setImage] = useState('');
  const [showAlertPass, setShowAlertPass] = useState(false);
  const [showAlertName, setShowAlertName] = useState(false);
  const [showAlertSamePass, setShowAlertSamePass] = useState(false);
  const [showAlertEmail, setShowAlertEmail] = useState(false);
  const [showAlertImage, setShowAlertImage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showAlertRegFailed, setShowAlertRegFailed] = useState(false);
  const [messageRegFailed, setMessageRegFailed] = useState(false);

  const [score, setScore] = useState(0);

  const [value, setItem] = useSessionStorage('auth');
  const [time, setTime] = useSessionStorage('time');

  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value.replace(/\s+/g, ' '));
    const password = event.target.value.replace(/\s+/g, ' ');
    const checks = [
      { regex: /^.{12,128}$/u, points: 1 },
      { regex: /[a-z]/, points: 1 },
      { regex: /[A-Z]/, points: 1 },
      { regex: /[0-9]/, points: 1 },
      { regex: /[\p{S}\p{P}]/u, points: 1 },
      { regex: /[^a-zA-Z0-9]/, points: 1 },
    ];

    let s = 0;
    checks.forEach((check) => {
      if (check.regex.test(password)) {
        s += check.points;
      }
    });

    setScore(s);
  };

  const handleNewPasswordChange = (event) => {
    setnewPassword(event.target.value.replace(/\s+/g, ' '));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file.type.startsWith('image/')) {
      setImage(file);
      setShowAlertImage(false);
    } else {
      setShowAlertImage(true);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    const lengthRegex = /^.{12,128}$/u;
    const charRegex = /^[\p{L}\p{N}\p{S}\p{P} ]+$/u;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const imageRegex = /\.(jpe?g|tiff?|png|webp)$/i;

    if (!lengthRegex.test(password) || !charRegex.test(password)) {
      setShowAlertPass(true);
    } else {
      setShowAlertPass(false);
    }
    if (username.length < 3) {
      setShowAlertName(true);
    } else {
      setShowAlertName(false);
    }
    if (password !== newPassword) {
      setShowAlertSamePass(true);
    } else {
      setShowAlertSamePass(false);
    }
    if (!emailRegex.test(email)) {
      setShowAlertEmail(true);
    } else {
      setShowAlertEmail(false);
    }

    if (!imageRegex.test(image.name) || image.size > 5000000) {
      setShowAlertImage(true);
    } else {
      setShowAlertImage(false);
    }

    if (
      !lengthRegex.test(password) ||
      !charRegex.test(password) ||
      username.length < 3 ||
      password !== newPassword ||
      !emailRegex.test(email) ||
      !imageRegex.test(image.name) ||
      image.size > 5000000
    ) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('role', 'user');
      formData.append('img', image);
      axios
        .post('/user/add', formData)
        .then((res) => {
          if (res && res.status === 200) {
            console.log('Register successful');
            setUsername('');
            setEmail('');
            setPassword('');
            setImage('');

            setItem({
              id: res.data.id,
              name: res.data.name,
              email: res.data.email,
              role: res.data.role,
              token: res.data.token,
            });

            setTime(new Date());
            navigate('/');
          } else {
            console.error('Register failed');
          }
        })
        .catch((err) => {
          setShowAlertRegFailed(true);
          setMessageRegFailed(err.response.data.message);
        });
    } catch (error) {
      console.error('Error during API call', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="hero min-h-screen bg-[url('/src/assets/shopping2.jpg')] bg-cover">
        <div className="items-center justify-center w-full hero-content">
          <div className="w-1/2 m-4 shadow-2xl card bg-base-100">
            <form className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  placeholder="name"
                  className="input input-bordered"
                  required
                  value={username}
                  onChange={handleUsernameChange}
                />
              </div>
              {showAlertName && (
                <div className="alert alert-warning">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 stroke-current shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>Warning: Name must have at least 3 characters!</span>
                </div>
              )}
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
              {showAlertEmail && (
                <div className="alert alert-warning">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 stroke-current shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>Warning: Email must be valid!</span>
                </div>
              )}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <div className="w-full join">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="password"
                    className="w-full input input-bordered join-item"
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
              {password.length > 0 && score < 3 && (
                <div>
                  <span className="text-error">Password is too weak!</span>
                  <progress
                    className="progress progress-error "
                    value={score}
                    max="6"
                  ></progress>
                </div>
              )}
              {password.length > 0 && score >= 3 && score < 5 && (
                <div>
                  <span className="text-warning">Password is medium!</span>
                  <progress
                    className="progress progress-warning "
                    value={score}
                    max="6"
                  ></progress>
                </div>
              )}
              {password.length > 0 && score >= 5 && (
                <div>
                  <span className="text-success">Password is strong!</span>
                  <progress
                    className="progress progress-success "
                    value={score}
                    max="6"
                  ></progress>
                </div>
              )}
              {showAlertPass && (
                <div className="alert alert-warning">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 stroke-current shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>
                    Warning: Password must have beetwen 12 and 128 characters.
                    It can contain letters, numbers and symbols!
                  </span>
                </div>
              )}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <div className="w-full join">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="password"
                    className="w-full input input-bordered join-item"
                    required
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                  />
                  <button
                    type="button"
                    className="btn btn-bordered join-item"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <RiEyeCloseLine /> : <RiEyeLine />}
                  </button>
                </div>
              </div>
              {showAlertSamePass && (
                <div className="alert alert-error">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 stroke-current shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Error! The passwords are not the same!</span>
                </div>
              )}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Image</span>
                </label>
                <input
                  type="file"
                  placeholder="Image"
                  className="file-input input-bordered "
                  onChange={handleImageChange}
                />
              </div>
              {showAlertImage && (
                <div className="alert alert-error">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 stroke-current shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    Error: Image must be a .jpg, .jpeg, .png or .webp file and
                    the size should be less than 5mb!
                  </span>
                </div>
              )}
              {showAlertRegFailed && (
                <div className="alert alert-error">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 stroke-current shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Error: {messageRegFailed}</span>
                </div>
              )}
              <div className="flex items-center justify-center mt-6 form-control">
                <button
                  className="btn btn-primary"
                  onClick={handleRegister}
                >
                  Register
                </button>
              </div>
            </form>
          </div>
          <div className="w-1/2 p-4 text-start bg-base-100 opacity-80 rounded-xl">
            <h1 className="text-6xl font-bold">Sign up</h1>
            <p className="py-6 text-xl">
              Register now and start shopping!
              <br />
              Enjoy the best products at the best prices!
            </p>
            <p className="py-2">
              Already have an account?{' '}
              <a
                onClick={() => navigate('/login')}
                className="link link-accent"
              >
                Login
              </a>{' '}
              to your account.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default RegisterUserPage;
