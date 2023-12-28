import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { fetchData, getUrlParams } from '../../utils';

import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import ProductCard from '../layout/ProductCard';
import Filter from '../layout/Filter';
import axios from 'axios';

import useAuth from '../../hooks/useAuth';

const StorePage = () => {
  const navigate = useNavigate();
  const search_query = getUrlParams().get('search');
  const minPrice = getUrlParams().get('min');
  const maxPrice = getUrlParams().get('max');
  const catFilter = getUrlParams().getAll('category');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [isLoading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0.0);
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [origin, setOrigin] = useState('');
  const [stock, setStock] = useState(0);
  const [newCategory, setNewCategory] = useState('');

  const [showAlertName, setShowAlertName] = useState(false);
  const [showAlertDescription, setShowAlertDescription] = useState(false);
  const [showAlertPrice, setShowAlertPrice] = useState(false);
  const [showAlertCategory, setShowAlertCategory] = useState(false);
  const [showAlertImage, setShowAlertImage] = useState(false);
  const [showAlertStock, setShowAlertStock] = useState(false);
  const [showAlertNewCategory, setShowAlertNewCategory] = useState(false);

  const [addCategory, setAddCategory] = useState(false);
  const [catDescription, setCatDescription] = useState('');

  const [showSuccess, setShowSuccess] = useState(false);

  const { auth } = useAuth();
  const { acessToken } = auth;
  const { user } = auth; 

  useEffect(() => {
    const initialize = async () => {
      {
        const data_products = await fetchData('/product/list');
        const data_categories = await fetchData('/product/category/list');

        if (data_products && data_categories) {
          setLoading(false);
        }
        setProducts(data_products);
        setCategories(data_categories);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (search_query) {
      products.forEach((product) => {
        if (product.name.toLowerCase().includes(search_query.toLowerCase())) {
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      });
    }
  }, []);

  const [role, setRole] = useState('');

  useEffect(() => {
    const initialize = async () => {
      if (user) {
        const { id } = user;
        const acessToken = auth.acessToken;
        const data = await fetchData(`/user/view?id=${id}&token=${acessToken}`);
        setRole(data.role);
      }
    };
    initialize();
  }, []);

  const handleNameChange = (event) => {
    setName(event.target.value);
    if (event.target.value.length > 3) {
      setShowAlertName(false);
    }
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
    if (event.target.value.length > 3) {
      setShowAlertDescription(false);
    }
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
    if (event.target.value > 0) {
      setShowAlertPrice(false);
    }
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    if (event.target.value.length > 0) {
      setShowAlertCategory(false);
      setShowAlertNewCategory(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    setImage(event.target.files[0]);
    const imageRegex = /\.(jpe?g|tiff?|png|webp)$/i;
    if (
      file < 5000000 ||
      imageRegex.test(image.name) ||
      file.type.startsWith('image/')
    ) {
      setImage(file);
      setShowAlertImage(false);
    } else {
      setShowAlertImage(true);
    }
  };

  const handleStockChange = (event) => {
    setStock(event.target.value);
    if (event.target.value > 0) {
      setShowAlertStock(false);
    }
  };

  const handleNewCategoryChange = (event) => {
    setNewCategory(event.target.value);
    if (event.target.value.length > 0) {
      setShowAlertNewCategory(false);
      setShowAlertCategory(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const imageRegex = /\.(jpe?g|tiff?|png|webp)$/i;
    const nameRegex = /^[a-zA-Z0-9 ]{3,30}$/;

    if (!nameRegex.test(name)) {
      setShowAlertName(true);
    } else {
      setShowAlertName(false);
    }
    if (description.length < 1) {
      setShowAlertDescription(true);
    } else {
      setShowAlertDescription(false);
    }
    if (price.valueOf() <= 0) {
      setShowAlertPrice(true);
    } else {
      setShowAlertPrice(false);
    }
    if (category.length < 1) {
      setShowAlertCategory(true);
    } else {
      setShowAlertCategory(false);
    }
    if (!imageRegex.test(image.name) || image.size > 5000000) {
      setShowAlertImage(true);
    } else {
      setShowAlertImage(false);
    }
    if (stock.valueOf() <= 0) {
      setShowAlertStock(true);
    } else {
      setShowAlertStock(false);
    }
    if (addCategory && newCategory.length < 1) {
      setShowAlertNewCategory(true);
    } else {
      setShowAlertNewCategory(false);
    }

    if (
      showAlertCategory ||
      showAlertDescription ||
      showAlertImage ||
      showAlertName ||
      showAlertPrice ||
      showAlertStock ||
      showAlertNewCategory
    ) {
      return;
    }

    if (addCategory) {
      const formData = new FormData();
      formData.append('name', newCategory);
      formData.append('description', catDescription);
      formData.append('userID', id);
      formData.append('token', acessToken);

      axios
        .post('http://localhost:8080/product/category/add', formData)
        .then((res) => {
          console.log(res);
        })
        .catch(console.error);
    }

    try {
      const formData2 = new FormData();
      formData2.append('name', name);
      formData2.append('description', description);
      formData2.append('img', image);
      formData2.append('origin', origin);
      formData2.append('price', price);
      formData2.append('in_stock', stock);
      if (addCategory) {
        console.log(
          'categories.length -> ',
          (categories.length + 1).toString()
        );

        formData2.append('category', (categories.length + 1).toString());
      } else {
        formData2.append('category', category);
      }
      formData2.append('userID', id);
      formData2.append('token', acessToken);

      axios
        .post('http://localhost:8080/product/add', formData2)
        .then((res) => {
          console.log(res);
          setShowSuccess(true);
          document.getElementById('modal_AddProduct').close();
          const initialize = async () => {
            const data_products = await fetchData('/product/list');
            const data_categories = await fetchData('/product/category/list');

            if (data_products && data_categories) {
              setLoading(false);
            }
            setProducts(data_products);
            setCategories(data_categories);
          };

          initialize();
        })
        .catch(console.error);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log('Products -> ', products);
    console.log('Categories -> ', categories);
  }, []);

  return (
    <div>
      <Navbar />
      {showSuccess && (
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
          <span>Product Added Successfully!</span>
        </div>
      )}
      {search_query && (
        <div className=" bg-accent mx-[5%] m-2 p-4 rounded-xl  ">
          {notFound ? (
            <h1>
              Your search <b className="font-extrabold">{search_query}</b> did
              not generated any results{' '}
            </h1>
          ) : (
            <h3>You've searched for: {search_query}</h3>
          )}
        </div>
      )}
      <div className="flex justify-between mx-[5%]">
        <div className="w-[20vw] flex-none">
          <Filter
            categories={categories}
            minPrice={minPrice}
            maxPrice={maxPrice}
            categoryFilter={catFilter}
          />
          {role === 'admin' && (
            <div className="w-[20vw] flex flex-wrap justify-center">
              <button
                className="btn btn-accent w-[18vw] m-4"
                onClick={() =>
                  document.getElementById('modal_AddProduct').showModal()
                }
              >
                Add Product
              </button>
            </div>
          )}
        </div>
        {isLoading ? (
          <div className="flex justify-center">
            <span className="loading loading-dots loading-lg"></span>
          </div>
        ) : notFound ? (
          <div className="justify-center w-full h-full m-48">
            <h1 className="text-xl font-bold text-center">No products found</h1>
          </div>
        ) : (
          <div className="flex flex-wrap h-full mb-4 justify-items-start">
            {products
              .filter((product) => {
                if (search_query) {
                  return product.name
                    .toLowerCase()
                    .includes(search_query.toLowerCase());
                }
                return true;
              })
              .filter((product) => {
                if (minPrice && maxPrice) {
                  return (
                    parseFloat(product.price) >= minPrice &&
                    parseFloat(product.price) <= maxPrice
                  );
                }
                if (minPrice) {
                  return parseFloat(product.price) >= minPrice;
                }
                if (maxPrice) {
                  return parseFloat(product.price) <= maxPrice;
                }
                return true;
              })
              .filter((product) => {
                if (catFilter.length > 0) {
                  return catFilter.includes(product.categoryID);
                }
                return true;
              })
              .map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isStore
                />
              ))}
          </div>
        )}
      </div>

      <Footer />
      <dialog
        id="modal_AddProduct"
        className="modal"
      >
        <div className="modal-box">
          <h3 className="text-lg font-bold">Add Product!</h3>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              placeholder="name"
              className="input input-bordered"
              required
              value={name}
              onChange={handleNameChange}
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
              <span>Warning: Name not valid!</span>
            </div>
          )}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <input
              type="text"
              placeholder="description"
              className="input input-bordered"
              required
              value={description}
              onChange={handleDescriptionChange}
            />
          </div>
          {showAlertDescription && (
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
              <span>Warning: Description not valid!</span>
            </div>
          )}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Origin</span>
            </label>
            <input
              type="text"
              placeholder="description"
              className="input input-bordered"
              required
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Price</span>
            </label>
            <input
              type="number"
              placeholder="price"
              className="input input-bordered"
              required
              value={price}
              onChange={handlePriceChange}
            />
          </div>
          {showAlertPrice && (
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
              <span>Warning: Price must be higher than 0!</span>
            </div>
          )}
          <div className="form-control">
            <label className="label">
              <span className="label-text">stock</span>
            </label>
            <input
              type="number"
              placeholder="stock"
              className="input input-bordered"
              required
              value={stock}
              onChange={handleStockChange}
            />
          </div>
          {showAlertStock && (
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
              <span>Warning: Stock must be higher than 0!</span>
            </div>
          )}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Category</span>
            </label>
            <select
              className="w-full select select-bordered"
              onChange={handleCategoryChange}
              defaultValue={-1}
            >
              <option
                disabled="disabled"
                key={-1}
              >
                Choose Category
              </option>
              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                  onClick={() => setAddCategory(false)}
                >
                  {category.nome}
                </option>
              ))}
              <option
                value=""
                onClick={() => setAddCategory(true)}
              >
                + Add Category
              </option>
            </select>
            {showAlertCategory && (
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
                <span>Warning: Category not valid!</span>
              </div>
            )}
            {addCategory && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Category Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  className="input input-bordered"
                  required
                  value={newCategory}
                  onChange={handleNewCategoryChange}
                />

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Category Description</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Description"
                    className="input input-bordered"
                    value={catDescription}
                    onChange={(e) => setCatDescription(e.target.value)}
                  />
                </div>
                {showAlertNewCategory && (
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
                    <span>Warning: Category not valid!</span>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Image</span>
            </label>
            <input
              type="file"
              placeholder="image"
              className="file-input input-bordered"
              required
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
                Error: Image must be a .jpg, .jpeg, .png or .webp file and the
                size should be less than 5mb!
              </span>
            </div>
          )}
          <div className="flex flex-wrap justify-between mt-4">
            <button
              type="submit"
              className="btn btn-accent btn-md w-[48%]"
              onClick={handleSubmit}
            >
              Add Product
            </button>
            <button
              className="btn btn-error btn-md w-[48%]"
              onClick={() =>
                document.getElementById('modal_AddProduct').close()
              }
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default StorePage;
