import { useState } from "react";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function RegisterUserPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [image, setImage] = useState("");
  const [showAlertPass, setShowAlertPass] = useState(false);
  const [showAlertName, setShowAlertName] = useState(false);
  const [showAlertSamePass, setShowAlertSamePass] = useState(false);
  const [showAlertEmail, setShowAlertEmail] = useState(false);
  const [showAlertNumberCard, setShowAlertNumberCard] = useState(false);
  const [showAlertImage, setShowAlertImage] = useState(false);

  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setnewPassword(event.target.value);
  };

  const handleCardNumberChange = (event) => {
    setCardNumber(event.target.value);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+]).{8,}$/;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const cardNumberRegex = /^[0-9]{12}$/;

    const imageRegex = /\.(jpe?g|tiff?|png|webp)$/i;

    if (!passwordRegex.test(password)) {
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
    if (!cardNumberRegex.test(cardNumber)) {
      setShowAlertNumberCard(true);
    } else {
      setShowAlertNumberCard(false);
    }
    if (!imageRegex.test(image.name) || image.size > 5000000) {
      setShowAlertImage(true);
    } else {
      setShowAlertImage(false);
    }

    if (
      showAlertPass ||
      showAlertName ||
      showAlertSamePass ||
      showAlertEmail ||
      showAlertNumberCard ||
      showAlertImage
    ) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("cartao", cardNumber);
      formData.append("role", "user");
      formData.append("img", image);

      axios.post("http://localhost:8080/user/add", formData).then((res) => {
        const data = res.text();
        console.log(data);
        if (res.ok) {
          console.log("Register successful");
          setUsername("");
          setEmail("");
          setPassword("");
          setCardNumber("");
          setImage("");
          localStorage.setItem("user", data);
          navigate("/");
        } else {
          console.error("Register failed");
        }
      });
    } catch (error) {
      console.error("Error during API call", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="hero min-h-screen bg-[url('/src/assets/shopping2.jpg')] bg-cover">
        <div className="hero-content w-full justify-center items-center">
          <div className="card w-1/2 m-4 shadow-2xl bg-base-100">
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
                    className="stroke-current shrink-0 h-6 w-6"
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
                    className="stroke-current shrink-0 h-6 w-6"
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
                <input
                  type="password"
                  placeholder="password"
                  className="input input-bordered"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
              {showAlertPass && (
                <div className="alert alert-warning">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
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
                    Warning: Password must have at least 8 characters, 1
                    uppercase, 1 lowercase, 1 number and 1 special character!
                  </span>
                </div>
              )}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <input
                  type="password"
                  placeholder="password"
                  className="input input-bordered"
                  required
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                />
              </div>
              {showAlertSamePass && (
                <div className="alert alert-error">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
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
                  <span className="label-text">Card Number</span>
                </label>
                <input
                  type="text"
                  placeholder="Card Number"
                  className="input input-bordered"
                  required
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                />
              </div>
              {showAlertNumberCard && (
                <div className="alert alert-warning">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>Warning: Card Number must have 12 numbers!</span>
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
                    className="stroke-current shrink-0 h-6 w-6"
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
              <div className="form-control mt-6 flex justify-center items-center">
                <button className="btn btn-primary" onClick={handleRegister}>
                  Register
                </button>
              </div>
            </form>
          </div>
          <div className="text-start bg-base-100 opacity-80 p-4 rounded-xl w-1/2">
            <h1 className="text-6xl font-bold">Sign up</h1>
            <p className="py-6 text-xl">
              Register now and start shopping!<br/>Enjoy the best products at the
              best prices!
            </p>
            <p className='py-2'>
              Already have an account?{' '}
              <a onClick={() => navigate('/login')} className="link link-accent">
                Login
              </a>{' '}to your account.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default RegisterUserPage;
