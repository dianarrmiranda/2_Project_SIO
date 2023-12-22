import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiEyeLine, RiShoppingCartLine } from 'react-icons/ri';
import axios from 'axios';
import { API_BASE_URL } from '../../constants';

const ProductCard = ({ product, className, isStore }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [sucess, setSucess] = useState(false);

  useEffect(() => {
    const data_user = JSON.parse(localStorage.getItem('user'));
    setUser(data_user);
  }, []);

  return (
    <div
      className={`card compact ${
        isStore ? 'w-48 ' : 'w-96'
      } -bg-card-color my-2 ${className} m-2`}
    >
      <figure>
        <img
          className={`${
            isStore ? 'max-w-48 h-48' : 'max-w-96 h-96'
          } object-cover cursor-pointer`}
          src={product.img}
          alt={`${product.name}-from-deti-store`}
          onClick={() => navigate(`/store/product/${product.id}`)}
        />
      </figure>
      <div className="card-body">
        <div className="flex flex-col justify-around">
          <h3
            className={`card-title ${
              isStore ? 'text-sm' : 'text-md'
            } line-clamp-1 hover:line-clamp-none`}
          >
            {product.name}
          </h3>
          <p>{product.description}</p>
          <div className="flex justify-between py-2 align-text-bottom">
            <p className="text-accent font-bold">{product.price}€</p>
            <div className="card-actions justify-end">
              {sucess ? (
                <div
                  className="tooltip tooltip-accent tooltip-open tooltip-bottom"
                  data-tip="Added to cart!"
                >
                  <button
                    className=" btn-accent p-1 rounded-md  "
                    onClick={() => {
                      axios
                        .post(
                          `${API_BASE_URL}/user/addToCart?prod=${product.id}&userID=${user[0].id}&quantity=1`
                        )
                        .then((res) => {
                          if (res.status === 200) {
                            setSucess(true);
                            setTimeout(() => {
                              setSucess(false);
                            }, 2000);
                          }
                        });
                    }}
                  >
                    <RiShoppingCartLine />
                  </button>
                </div>
              ) : (
                <button
                  className=" btn-accent p-1 rounded-md  "
                  onClick={() => {
                    axios
                      .post(
                        `${API_BASE_URL}/user/addToCart?prod=${product.id}&userID=${user.id}&quantity=1&token=${user.token}`
                      )
                      .then((res) => {
                        if (res.status === 200) {
                          setSucess(true);
                          setTimeout(() => {
                            setSucess(false);
                          }, 2000);
                        }
                      });
                  }}
                >
                  <RiShoppingCartLine />
                </button>
              )}
              <button
                className=" btn-primary p-1 rounded-md "
                onClick={() => navigate(`/store/product/${product.id}`)}
              >
                <RiEyeLine />
              </button>
            </div>
          </div>
        </div>
        <span className="badge badge-outline badge-accent">
          Stock: {product.in_stock}
        </span>
        <button className=" badge badge-outline">{product.category}</button>
      </div>
    </div>
  );
};

export default ProductCard;
