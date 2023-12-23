import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../../utils";

import {
  RiAccountCircleLine,
  RiSunFill,
  RiMoonClearFill,
  RiShoppingBag2Line,
  RiSearch2Line
} from "react-icons/ri";

import logo from "../../assets/deti_store_logo.svg";

const Navbar = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );
  const [userInfo, setUserInfo] = useState([]);
  const [cartItems, setCartItems] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));
  
  useEffect(() => {
    const initialize = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      user && fetchData(`/user/view?id=${user.id}&token=${user.token}`).then((res) => {
        setUserInfo(res);
      })
    }
    initialize();
  }, []);
  
  useEffect(() => {
    setCartItems(userInfo?.shopping_Cart?.length);
  }, [userInfo]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const localTheme = localStorage.getItem("theme");

    document.querySelector("html").setAttribute("data-theme", localTheme);
  }, [theme]);
  
  const handleToggle = (e) => {
    if (e.target.checked) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="navbar bg-secondary w-full flex justify-between items-center p-2 top-0">
      <Link to="/" className="max-w-[5%]">
        <img src={logo}></img>
      </Link>
      <form className="join w-[40vw] justify-self-center">
        <input
          type="textbox"
          className="input input-sm input-bordered rounded-full input-primary join-item w-[40vw]"
          placeholder={'Search for products...'}
          name="search"
        />
        <button
          className="btn btn-primary btn-sm join-item rounded-full font-bold"
          type="submit  "
          onClick={() => {
            navigate(
              `/store?search=${document.getElementsByName('search')[0].value}`
            );
          }}
        >
          <RiSearch2Line />
          Search
        </button>
      </form>
      {user && (
        <p
          onClick={() => navigate(`/user`)}
          className="mr-2 cursor-grab"
        >
          {`Hello ${user.name}!`}
        </p>
      )}

      <div className="flex">
        <label className="swap swap-rotate m-2 p-2 ">
          <input
            id="search-box"
            type="checkbox"
            onChange={handleToggle}
            checked={theme === "light" ? false : true}
          />
          <RiMoonClearFill className="swap-on" />
          <RiSunFill className="swap-off" />
        </label>

        {user && (
          <div className="indicator">
            <span className="indicator-item badge-accent badge-sm rounded-full m-4 text-sm">
              {cartItems}
            </span>
            <button
              className="flex items-center m-2 p-2"
              onClick={() => navigate('/user/cart')}
            >
              <RiShoppingBag2Line className="text-xl" />
            </button>
          </div>
        )}

        {true && (
          <button
            className="flex items-center m-2 p-2"
            onClick={
              user
                ? () => navigate(`/user`)
                : () => navigate('/login')
            }
          >
            <RiAccountCircleLine className="text-xl" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
