import { useEffect, useState } from 'react';
import Footer from '../layout/Footer';
import Navbar from '../layout/Navbar';
import { useNavigate } from 'react-router-dom';
import { RiEyeCloseLine, RiEyeLine } from 'react-icons/ri';
import { fetchData, postData } from '../../utils';

const ResetPassPage = () => {
    const navigate = useNavigate();

    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [success, setSuccess] = useState(false);
    const [failed, setFailed] = useState(false);


    useEffect(() => {
        const t = new URLSearchParams(window.location.search).get('token');
        if (t) {
            setToken(t);
        } else {
        navigate('/');
        }
    }
        , []);
        
    const [showAlertPass, setShowAlertPass] = useState(false);
    const [showAlertSamePass, setShowAlertSamePass] = useState(false);
    const [score, setScore] = useState(0);

    const handlePasswordChange = (e) => {
        const pass = e.target.value;
        setPassword(pass);
        if (pass.length < 12 || pass.length > 128) {
            setShowAlertPass(true);
        } else {
            setShowAlertPass(false);
        }
        let score = 0;
        if (/[a-z]/.test(pass)) {
            score++;
        }
        if (/[A-Z]/.test(pass)) {
            score++;
        }
        if (/[0-9]/.test(pass)) {
            score++;
        }
        if (/[^a-zA-Z0-9]/.test(pass)) {
            score++;
        }
        if (/[\p{S}\p{P}]/u.test(pass)) {
            score++;
        }
        if (pass.length >= 12) {
            score++;
        }
        setScore(score);
    }

    const handleConfirmPasswordChange = (e) => {
        const pass = e.target.value;
        setConfirmPassword(pass);
        if (pass !== password) {
            setShowAlertSamePass(true);
        } else {
            setShowAlertSamePass(false);
        }
    }

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (password.length < 12 || password.length > 128) {
            setShowAlertPass(true);
        }
        if (password !== confirmPassword) {
            setShowAlertSamePass(true);
        }

        if (password.length >= 12 && password.length <= 128 && password === confirmPassword) {
            const res = await postData(`/user/resetPassword?token=${token}&password=${password}`);
            if (res === 'Password changed') {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else {
                setFailed(true);
            }
        }else {
            setFailed(true);
        }
        
    }

  return (
    <div>
        <Navbar />
      <div className="hero min-h-screen bg-[url('/src/assets/shopping2.jpg')] bg-cover">
        <div className="items-center justify-center w-full hero-content">
          <div className="w-1/2 m-4 shadow-2xl card bg-base-100">
            <form className="card-body">
            <h1 className="card-title">Reset Password</h1>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">New Password</span>
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
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="password"
                    className="w-full input input-bordered join-item"
                    required
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                  <button
                    type="button"
                    className="btn btn-bordered join-item"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <RiEyeCloseLine /> : <RiEyeLine />}
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
                {success && (
                    <div className="alert alert-success">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 stroke-current shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                        strokeLinecap="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                        />
                    </svg>
                    <span>Password changed successfully!</span>
                    </div>
                )}
                {failed && (
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
                        d="M5 13l4 4L19 7"
                        />
                    </svg>
                    <span>Error! Password not changed!</span>
                    </div>
                )}
              <div className="flex items-center justify-center mt-6 form-control">
                <button
                  className="btn btn-primary"
                  onClick={handleChangePassword}
                >
                  Sumbit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassPage;
