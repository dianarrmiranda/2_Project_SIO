import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

import { fetchData } from "../../utils";

import "./../../utils/styles.css";

import Navbar from "../layout/Navbar";
import Carousel from "../layout/Carousel";
import ProductCard from "../layout/ProductCard";
import Footer from "../layout/Footer";

const imgs = [
  "https://i.imgur.com/bRJ9Eki.jpeg",
  "https://i.imgur.com/ffDXQcD.jpeg",
  "https://i.imgur.com/ULExX9s.jpeg",
];

const HomePage = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [products, setProducts] = useState([]);
  const [hotDeals, setHotDeals] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      const data_products = await fetchData("/product/list");
      const data_hot = await fetchData("/product/listHotDeals");
      setProducts(data_products);
      setHotDeals(data_hot);
      if (data_products && data_hot) {
        setLoading(false);
      }
    };
    initialize();
    console.log("products -> ", products);
    console.log("auth -> ", auth)
  }, []);

  

  return (
    <div>
      <Navbar />
      <Carousel images={imgs} />
      <div id="body" className="mx-[5%]">
        {isLoading ? (
          <div className="justify-center">
            <span className="loading loading-dots loading-lg"></span>
          </div>
        ) : (
          <div className="my-4 rounded-xl">
            <div className="divider">
              <h1 className="m-2 text-2xl font-bold ">🔥 HOT DEALS 🔥</h1>
            </div>
            <div className="flex flex-row overflow-hidden hover:overflow-x-scroll snap-x">
              {hotDeals.map((product) => (
                <ProductCard
                  key={product.id}
                  className={"m-2 flex-none w-80 snap-end"}
                  product={product}
                />
              ))}
              {}
            </div>
          </div>
        )}

        <div className="divider"></div>

        <div className=" flex flex-col justify-center p-[10%]">
          <h1 className="my-4 text-xl font-bold">
            Find more products on our store page
          </h1>
          <button
            className="btn gradient-green hover:ring hover:ring-primary w-[10vw] font-bold text-white"
            onClick={() => navigate("/store")}
          >
            GO TO STORE
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
