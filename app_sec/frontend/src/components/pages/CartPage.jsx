import React, { useEffect, useState } from 'react';

import { fetchData } from '../../utils';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import { API_BASE_URL } from '../../constants';
import useAuth from '../../hooks/useAuth';

import { BsTrash } from 'react-icons/bs';
import { RiShoppingCart2Line } from 'react-icons/ri';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState({});

  const { auth, setAuth } = useAuth();

  const navigate = useNavigate();
  const username = auth?.user;
  const acessToken = auth?.acessToken;



  useEffect(() => {
    const initialize = async () => {
      if (Object.keys(auth).length === 0) {
        navigate('/login');
      } else {
        console.log('Username ->', username.id);

        const user = await fetchData(
          `/user/view?id=${username.id}&token=${acessToken}`
        );
        setUser(user);
        console.log('User ->', user);

        if (user) {
          setCart(user.shopping_Cart);
        }
      }
    };

    initialize();
    console.log('Cart ->', cart);
  }, []);

  useEffect(() => {
    setAuth({
      ...auth,
      user: {
        ...auth.user,
        shopping_Cart: cart,
      },
    });
  }, [cart]);

  

  return (
    <div className="bg-base-200">
      <Navbar />
      <div className="mx-[10%] p-8 ">
        <div className="flex flex-row text-3xl font-extrabold">
          <span className="flex flex-row p-2 m-2">
            <HiOutlineMenuAlt3 />
            <RiShoppingCart2Line />
          </span>
          <span className="m-2">Cart</span>
        </div>
        {cart.length > 0 ? (
          <div className="flex">
            <div className="flex flex-col w-3/4 h-full justify-evenly">
              {cart.map((item, idx) => (
                <div
                  key={item?.id}
                  className="flex flex-wrap p-2 m-2 shadow-lg hover:bg-secondary rounded-xl bg-base-100"
                  className="flex flex-wrap p-2 m-2 shadow-lg hover:bg-secondary rounded-xl bg-base-100"
                >
                  <div className="w-1/6 p-2 h-1/6">
                    <img
                      src={'../../../' + item?.prod?.imgSource}
                      alt=""
                      className="object-cover rounded-lg cursor-pointer"
                      onClick={() => {
                        navigate(`/store/product/${item?.prod?.ID}`);
                      }}
                    />
                  </div>
                  <div className="flex flex-col w-1/2 mx-4 justify-evenly">
                    <span className="flex flex-row items-center justify-start w-full">
                      <h1 className="p-2 text-xl font-bold">
                        {item?.prod?.name}
                      </h1>
                      <button
                        className="aboslute top-1 right-1 "
                        onClick={() => {
                          axios.post(
                            `${API_BASE_URL}/user/removeFromCart?prod=${item?.prod.ID}&userID=${user.id}&token=${acessToken}`
                          );
                          setCart((prev) => {
                            const newCart = [...prev];
                            newCart.splice(idx, 1);
                            return newCart;
                          });
                        }}
                      >
                        <BsTrash className="text-xl" />
                      </button>
                    </span>

                    <span className="mx-2">
                      Quantity:{' '}
                      <input
                        type="number"
                        min={1}
                        className="w-20 input input-bordered"
                        defaultValue={item?.quantity}
                        onChange={(e) => {
                          setCart((prev) => {
                            const newCart = [...prev];
                            newCart[idx].quantity = e.target.value;
                            return newCart;
                          });
                          axios.post(
                            `${API_BASE_URL}/user/addToCart?prod=${item?.prod.ID}&userID=${user.id}&quantity=${e.target.value}&token=${acessToken}`
                          );
                        }}
                      />
                    </span>
                    <div className="flex justify-between m-2">
                      <span className="font-light">
                        {item?.quantity}x {item?.prod?.price}€
                      </span>
                      <span className="font-extrabold text-accent-focus">
                        {(item?.prod?.price * item.quantity).toFixed(2)}€
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-1/4 h-full">
              <div className="w-full p-4 m-2 shadow-xl bg-base-100 rounded-xl">
                <h1 className="text-xl font-light divider">Total</h1>
                <span className="flex justify-between my-2 mt-0">
                  <h1 className="font-bold">Subtotal</h1>
                  {cart
                    .reduce(
                      (acc, item) => acc + item.prod.price * item.quantity,
                      0
                    )
                    .toFixed(2)}
                  €
                </span>
                <span className="flex justify-between my-2">
                  <h1 className="font-bold">Shipping</h1>
                  <span>-</span>
                </span>
                <span className="flex justify-between my-2">
                  <h1 className="font-bold">Discoount</h1>
                  <span>-</span>
                </span>
                <div className="divider" />
                <div className="flex justify-between my-2">
                  <h1 className="font-bold">Total</h1>
                  <span>
                    {cart
                      .reduce(
                        (acc, item) => acc + item.prod.price * item.quantity,
                        0
                      )
                      .toFixed(2)}
                    €
                  </span>
                </div>
              </div>
              <button
                className="w-full m-2 text-lg shadow-xl btn btn-primary"
                onClick={() => {
                  navigate('/user/checkout');
                }}
              >
                Checkout
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col w-full h-[60vh] justify-center align-center">
            <span className="flex flex-row justify-center">
              <HiOutlineMenuAlt3 className="text-9xl text-accent" />
              <RiShoppingCart2Line className="text-9xl text-accent" />
            </span>
            <span className="flex justify-center">
              <h1 className="m-4 text-3xl font-light text-accent">
                Cart is empty!
              </h1>
            </span>
            <span className="flex justify-center">
              <button
                className="m-4 btn btn-primary"
                onClick={() => {
                  navigate('/store');
                }}
              >
                Explore Store
              </button>
            </span>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
