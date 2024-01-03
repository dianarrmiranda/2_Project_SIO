import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSessionStorage from '../../hooks/useSessionStorage';
import useRefreshToken from '../../hooks/useRefreshToken';
// import useAxios from '../../hooks/useAxios';

import axios from '../../api/axios';

import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';

import {
  RiEyeCloseLine,
  RiEyeLine,
  RiEditLine,
  RiLogoutBoxLine,
  RiDeleteBinLine,
  RiFilePdf2Line,
} from 'react-icons/ri';

import { formatTime } from '../../utils';

const ProductPage = () => {
  const [item, setItem, removeItem] = useSessionStorage('auth');
  const [time] = useSessionStorage('time');

  const refreshToken = useRefreshToken();
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [actualPassword, setActualPassword] = useState('');
  const [showAlertPass, setShowAlertPass] = useState(false);
  const [showAlertSamePass, setShowAlertSamePass] = useState(false);
  const [changeSuccess, setchangeSuccess] = useState(false);
  const [showChangeFail, setShowChangeFail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showAtualPassword, setShowAtualPassword] = useState(false);

  const [messageChangePassFailed, setMessageChangePassFailed] = useState(false);

  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(15);

  useEffect(() => {
    const initialize = async () => {
      if (!item) {
        navigate('/login');
      }
      try {
        const { id, token } = item;
        const data = await axios
          .get(`/user/view?id=${id}&token=${token}`)
          .then((res) => {
            console.log('res -> ', res.data);
            return res.data;
          });

        console.log('data -> ', data);

        setUser(data);

        console.log('User ->', item);
      } catch (error) {
        console.error('Failed to fetch data: ', error);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    setInterval(() => {
      let timeLimit = new Date(time).getTime() / 1000 + 15 * 60;
      let timeNow = new Date().getTime() / 1000;
      let timeDiff = timeLimit - timeNow;
      setTimer(formatTime(timeDiff));
    }, 1000);
  }, [time, setTimer]);

  const handleLogout = () => {
    removeItem();
    navigate('/login');
  };

  const handleChangePassword = (event) => {
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

  const handleChangePass = async (event) => {
    event.preventDefault();

    const lengthRegex = /^.{12,128}$/u;
    const charRegex = /^[\p{L}\p{N}\p{S}\p{P} ]+$/u;

    if (!lengthRegex.test(password) || !charRegex.test(password)) {
      setShowAlertPass(true);
    } else {
      setShowAlertPass(false);
    }
    if (password !== newPassword) {
      setShowAlertSamePass(true);
    } else {
      setShowAlertSamePass(false);
    }

    if (
      !lengthRegex.test(password) ||
      !charRegex.test(password) ||
      password !== newPassword
    ) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('token', token);
      formData.append('newPassword', password);
      formData.append('oldPassword', actualPassword);

      axios
        .post('/user/updatePassword', formData)
        .then((response) => {
          if (response.status === 200) {
            setShowChangeFail(false);
            setchangeSuccess(true);
            setTimeout(() => {
              document.getElementById('modal_ChangePass').close();
              setchangeSuccess(false);
            }, 2000);
          }
        })
        .catch((error) => {
          setShowChangeFail(true);
          setMessageChangePassFailed(error.response.data.message);
        });
    } catch (error) {
      console.error('Error during API call', error);
    }
  };

  const handleViewDetails = (purchase) => {
    setSelectedOrder(purchase.items);
    document.getElementById('modal_viewDetails').showModal();
  };

  const handleDeleteAccount = async () => {
    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('token', token);

      const response = await axios.put('/user/deleteUserData', formData);
      if (response.status === 200) {
        handleLogout();
      }
    } catch (error) {
      console.error('Error during API call', error);
    }
  };

  const handleExportData = async () => {
    try {
      const response = await axios.get('/user/exportUserData', {
        params: {
          id: user.id,
          token: item.token,
        },
        responseType: 'arraybuffer',
      });

      if (response.status === 200) {
        // Create a Blob from the PDF data
        const blob = new Blob([response.data], { type: 'application/pdf' });

        // Create a download link and click it
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my_deti_store_data.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error during API call', error);
    }
  };

  return (
    <div className="bg-base-200">
      <Navbar />

      <div className="flex flex-wrap mx-[5%]">
        <div className="flex flex-row w-full p-4 m-4 shadow-lg bg-base-100 rounded-xl">
          <div className="w-40 avatar">
            <img
              src={user.image}
              alt="User Image"
              className="object-cover w-full h-full rounded-xl"
            />
          </div>
          <span className="mx-4">
            <div className="flex flex-row justify-between">
              <h1 className="mb-2 text-2xl font-bold">{user.name}</h1>
              <div className="flex flex-row items-center justify-between px-4 py-1 pr-1 font-bold text-center rounded-full bg-secondary">
                <h1 className="text-2xl font-bold ">{timer}</h1>
                <button
                  className="ml-4 rounded-full btn btn-accent"
                  onClick={() => {
                    refreshToken();
                    window.location.reload();
                  }}
                >
                  Extend Session
                </button>
              </div>
            </div>
            <p className="mb-2 text-lg">{user.email}</p>

            <div className="flex">
              <button
                className="mb-2 mr-2 btn btn-accent"
                onClick={() =>
                  document.getElementById('modal_ChangePass').showModal()
                }
              >
                <RiEditLine className="text-xl" />
                Change Password
              </button>
              <button
                className="mb-2 btn btn-accent"
                onClick={handleLogout}
              >
                <RiLogoutBoxLine className="text-xl" />
                Logout
              </button>
              <button
                className="btn btn-accent bg-[#ce3a27] hover:bg-[#66180e] ml-2 mb-2"
                onClick={() =>
                  document.getElementById('modal_deleteAccount').showModal()
                }
              >
                <RiDeleteBinLine className="text-xl" />
                Delete my account
              </button>
              <button
                className="mb-2 ml-2 btn btn-accent flex-right"
                onClick={handleExportData}
              >
                <RiFilePdf2Line className="text-xl" />
                Export my data
              </button>
            </div>
          </span>
        </div>

        <div className="w-full h-full p-4 m-4 shadow-lg rounded-xl bg-base-100">
          <h2 className="mt-4 mb-2 text-2xl font-bold">My orders</h2>
          {user?.request_History?.length === 0 ? (
            <p>No purchases done yet</p>
          ) : (
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>State</th>
                  <th>Total Spent</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {user.request_History?.map((purchase, idx) => (
                  <tr key={idx}>
                    <td>{purchase.id}</td>
                    <td>Delivered</td>
                    <td>{purchase.total.toFixed(2)}€</td>
                    <td>
                      <button
                        className="btn btn-accent"
                        onClick={() => handleViewDetails(purchase)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Footer />

      <dialog
        id="modal_ChangePass"
        className="modal"
      >
        <div className="modal-box">
          <h3 className="text-lg font-bold">Change Password!</h3>
          {showChangeFail && (
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
              <span>{messageChangePassFailed}</span>
            </div>
          )}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Actual Password</span>
            </label>
            <div className="w-full join">
              <input
                type={showAtualPassword ? 'text' : 'password'}
                placeholder="password"
                className="w-full input input-bordered join-item"
                required
                value={actualPassword}
                onChange={(e) =>
                  setActualPassword(e.target.value.replace(/\s+/g, ' '))
                }
              />
              <button
                type="button"
                className="btn btn-bordered join-item"
                onClick={() => setShowAtualPassword(!showAtualPassword)}
              >
                {showAtualPassword ? <RiEyeCloseLine /> : <RiEyeLine />}
              </button>
            </div>
          </div>
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
                onChange={handleChangePassword}
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
                Warning: Password must have beetwen 12 and 128 characters. It
                can contain letters, numbers and symbols!
              </span>
            </div>
          )}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Confirm New Password</span>
            </label>
            <div className="w-full join">
              <input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="password"
                className="w-full input input-bordered join-item"
                required
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value.replace(/\s+/g, ' '))
                }
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
          {changeSuccess && (
            <div className="alert alert-success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 stroke-current shrink-0"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Pass Changed Successfully!</span>
            </div>
          )}
          <div className="flex modal-action">
            <form method="dialog">
              <button
                className="mr-2 btn btn-primary"
                onClick={handleChangePass}
              >
                Submit
              </button>
            </form>
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog
        id="modal_deleteAccount"
        className="modal"
      >
        <div className="modal-box">
          <h3 className="text-lg font-bold">Delete My Account</h3>
          <p>Are you sure you want to delete your account?</p>
          <p>This action is irreversible!</p>
          <div className="flex modal-action">
            <form method="dialog">
              <button
                className="mr-2 btn btn-primary"
                onClick={handleDeleteAccount}
              >
                Confirm Deletion
              </button>
            </form>
            <form method="dialog">
              <button className="btn">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog
        id="modal_viewDetails"
        className="modal"
      >
        <div className="modal-box">
          <h3 className="text-lg font-bold">Order Details</h3>
          <table className="table w-full">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>SubTotal</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder?.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.prod.name}</td>
                  <td>{item.prod.price}€</td>
                  <td>{item.quantity}</td>
                  <td>{item.prod.price * item.quantity}€</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ProductPage;
