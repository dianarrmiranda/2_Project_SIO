import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../layout/Navbar';

import { fetchData } from '../../utils';
import Footer from '../layout/Footer';
import ProductComments from '../layout/ProductComments';
import Rating from '@mui/material/Rating';

import axios from 'axios';
import { API_BASE_URL } from '../../constants';

import {
  RiFlashlightLine,
  RiShoppingCartFill,
  RiRocketLine,
} from 'react-icons/ri';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({});
  const [user_id, setUser_id] = useState('');
  const [token, setToken] = useState('');
  const [comments, setComments] = useState([]);
  const [stock, setStock] = useState(product.in_stock);
  const [role, setRole] = useState('');
  const [toggleResponse, setToggleResponse] = useState(false);

  const username = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const initialize = async () => {
      const data = await fetchData(`/product/view?id=${id}`);
      if (username) {
        const dataUser = await fetchData(
          `/user/view?id=${username.id}&token=${username.token}`
        );
        setUser_id(username.id);
        setToken(username.token);
        setRole(dataUser.role);
      }
      else {
        setUser_id(null);
      }
      if(data) {
        setProduct(data);
        setComments(data.reviews);
      }
    };
    initialize();
    console.log('Product ->', product);
  }, []);

  const handleAddToCart = () => {
    axios
      .post(
        `${API_BASE_URL}/user/addToCart?prod=${
          product.id
        }&userID=${user_id}&quantity=${
          document.getElementById('qty').value
        }&token=${username.token}`
      )
      .then((res) => {
        console.log(res);
      });
  };

  function showModal() {
    const modal = document.getElementById('modalStock');
    modal.showModal();
  }
  const handleStock = () => {
    axios
      .post(
        `${API_BASE_URL}/product/updateStock?id=${product.id}&stock=${stock}&userID=${user_id}&token=${token}`
      )
      .then((res) => {
        console.log(res);
      });
  };

  
  return (
    <div className="bg-base-200">
      <Navbar />
      <div
        id="content-body"
        className="mx-[10%] bg-base-100 p-4"
      >
        <div className="flex flex-row">
          <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-4">
            <img
              src={'../../' + product.imgSource}
              alt={`${product.name}-from-deti-store`}
              className="w-[30vw]  object-cover mx-[10%] rounded-xl"
            />
          </div>
          <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 left-2 my-4 flex flex-col justify-between">
            <h1 className="text-2xl font-extrabold ">{product.name}</h1>
            <span className="divider my-0" />
            <button
              className="text-lg font-bold my-2 badge badge-outline p-3"
              onClick={() => {
                navigate(`/store?category=${product.category?.id}`);
              }}
            >
              {product.category?.name}
            </button>

            <h2 className="text-lg">
              From:{' '}
              <span className="font-bold text-accent">{product.origin}</span>
            </h2>
            <div>
              <h2 className="text-lg text-accent-focus">Score</h2>
              <div className="flex flex-row justify-items-center mb-2">
                <Rating
                  precision={0.1}
                  value={Number(parseFloat(product.average_Stars).toFixed(2))}
                  readOnly
                  size="small"
                />
                <span className="text-accent-focus ml-2">
                  (
                  {product.average_Stars
                    ? parseFloat(product.average_Stars).toFixed(1)
                    : 'No reviews yet'}
                  )
                </span>
              </div>
            </div>

            <div className="flex flex-wrap justify-start align-items-bottom">
              <p className="font-extrabold text-primary-focus text-2xl mb-2">
                {product.price}€
              </p>
              <span className="text-lg text-accent mx-10 flex-row ">
                qty:{' '}
                <input
                  type="number"
                  id="qty"
                  min={1}
                  defaultValue={1}
                  className="input input-sm input-accent input-bordered border-2 w-[5vw] "
                />
              </span>
            </div>
            <div className="text-accent flex flex-row">
              <RiFlashlightLine className="mx-2" />
              Free shipping for national orders
              <RiFlashlightLine className="mx-2" />
            </div>
            {user_id == null && (
              <label
                htmlFor="cart_btns"
                className="text-sm mt-4"
              >
                You have to be logged in to add products to your cart!{' '}
                <span
                  className="underline text-accent cursor-pointer"
                  onClick={() => navigate('/login')}
                >
                  Log in!
                </span>
              </label>
            )}
            <span
              id="cart_btns"
              className="flex flex-row"
            >
              <button
                className="btn btn-primary mx-2"
                onClick={handleAddToCart}
                disabled={user_id == null}
              >
                Add to cart <RiShoppingCartFill className="ml-2" />
              </button>
              <button
                className="btn btn-accent mx-2"
                onClick={() => {
                  navigate('/user/cart');
                }}
                disabled={user_id == null}
              >
                Buy Now <RiRocketLine className="ml-2" />
              </button>
            </span>
            {role === 'admin' && (
              <button
                className="btn btn-accent relative top-8 mb-2"
                onClick={showModal}
              >
                Change Stock
              </button>
            )}
          </div>
        </div>

        <div className="my-8 mb-16">
          <div className="mb-4 flex flex-wrap ">
            <button
              className={`font-medium ${
                toggleResponse ? 'text-accent' : 'underline underline-offset-8'
              } ease-in-out cursor-grab mx-2`}
              onClick={() => setToggleResponse(false)}
            >
              Description
            </button>
            <button
              className={`font-medium ${
                toggleResponse ? 'underline underline-offset-8' : 'text-accent'
              } cursor-grab mx-2 ease-in-out`}
              onClick={() => setToggleResponse(true)}
            >
              Discusion({comments.length})
            </button>
          </div>

          {toggleResponse ? (
            <div>
              <ProductComments
                comments={comments}
                user_id={user_id}
                product={product}
                setComments={setComments}
              />
            </div>
          ) : (
            <div>{product.description}</div>
          )}
        </div>
      </div>

      <Footer />
      <dialog
        id="modalStock"
        className="modal"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Change Stock</h3>
          <div className="form-control">
            <label className="label">
              <span className="label-text">New Stock</span>
            </label>
            <input
              type="number"
              className="input input-bordered"
              defaultValue={product.in_Stock}
              onChange={(e) =>
                setStock(e.target.value > 0 ? e.target.value : 0)
              }
              required
            />
            <div className="modal-action">
              <form method="dialog">
                <button className="btn">Close</button>
                <button
                  className="btn btn-primary"
                  onClick={handleStock}
                >
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ProductPage;
