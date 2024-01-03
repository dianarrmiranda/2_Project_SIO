import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import axios from '../../api/axios';

import useSessionStorage from '../../hooks/useSessionStorage';

import {
  RiAccountCircleLine,
  RiSunFill,
  RiMoonClearFill,
  RiShoppingBag2Line,
  RiSearch2Line,
} from 'react-icons/ri';

import { formatTime } from '../../utils';

import logo from '../../assets/deti_store_logo.svg';

const Navbar = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light'
  );
  const [userInfo, setUserInfo] = useState([]);
  const [noItems, setNoItems] = useState(0);
  const [user, setUser] = useSessionStorage('auth');
  const [time] = useSessionStorage('time');
  const [timer, setTimer] = useState(15);

  useEffect(() => {
    const initialize = async () => {
      user &&
        axios
          .get(`/user/view?id=${user.id}&token=${user.token}`)
          .then((res) => {
            setUserInfo(res);
          }).catch((err) => {
            console.error(err);
            if (err.response.status === 401) {
              setUser(null);
              navigate('/login');
            }
          });
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

  useEffect(() => {
    if (user) {
      setNoItems(user.shopping_Cart?.length);
    }
  }, [user?.shopping_Cart]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const localTheme = localStorage.getItem('theme');

    document.querySelector('html').setAttribute('data-theme', localTheme);
  }, [theme]);

  const handleToggle = (e) => {
    if (e.target.checked) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="top-0 flex items-center justify-between w-full p-2 navbar bg-secondary">
      <Link
        to="/"
        className="max-w-[5%]"
      >
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
          className="font-bold rounded-full btn btn-primary btn-sm join-item"
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
        <div className='flex flex-row items-center justify-between'>
          <p
            onClick={() => navigate(`/user`)}
            className="mr-2 cursor-grab"
          >
            {`Hello ${user?.name}!`}
          </p>
          <p onClick={() => navigate("/user")} className="mx-2 cursor-pointer badge badge-accent">{`Session expires in ${timer}`}</p>
        </div>
      )}

      <div className="flex">
        <label className="p-2 m-2 swap swap-rotate ">
          <input
            id="search-box"
            type="checkbox"
            onChange={handleToggle}
            checked={theme === 'light' ? false : true}
          />
          <RiMoonClearFill className="swap-on" />
          <RiSunFill className="swap-off" />
        </label>

        {user && (
          <div className="indicator">
            <span className="m-4 text-sm rounded-full indicator-item badge-accent badge-sm">
              {user ? user.shopping_Cart?.length : 0}
            </span>
            <button
              className="flex items-center p-2 m-2"
              onClick={() => navigate('/user/cart')}
            >
              <RiShoppingBag2Line className="text-xl" />
            </button>
          </div>
        )}

        {true && (
          <button
            className="flex items-center p-2 m-2"
            onClick={user ? () => navigate(`/user`) : () => navigate('/login')}
          >
            <RiAccountCircleLine className="text-xl" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
