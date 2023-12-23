import { useEffect, useState } from "react";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import { RiBankCardLine } from "react-icons/ri";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import { fetchData } from "../../utils";
import { maskCreditCard } from "../../utils";
import { API_BASE_URL } from "../../constants";
import Warning from "../layout/Warning";

const CheckoutPage = () => {
  const navigate = useNavigate();

  const username = JSON.parse(localStorage.getItem("user"));
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState([]);
  const [cards, setCards] = useState([]);
  const [newCard, setNewCard] = useState({
    card_name: "",
    card_number: "",
    expiration_date: "",
    cvv: "",
  });

  const [form, setForm] = useState({
    delivery_day: "",
    delivery_time: "",
    address: "",
    address2: "",
    city: "",
    country: "",
    zip_code: "",
    card: -1,
  });

  const [delivery_dayAlert, setDelivery_dayAlert] = useState(false);
  const [delivery_timeAlert, setDelivery_timeAlert] = useState(false);
  const [addressAlert, setAddressAlert] = useState(false);
  const [address2Alert, setAddress2Alert] = useState(false);
  const [cityAlert, setCityAlert] = useState(false);
  const [countryAlert, setCountryAlert] = useState(false);
  const [zip_codeAlert, setZip_codeAlert] = useState(false);
  const [cardAlert, setCardAlert] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      const saved_cards = JSON.parse(localStorage.getItem("cards"));
      const data_user = await fetchData(
        `/user/view?id=${username.id}&token=${username.token}`
      );

      if (data_user) {
        setUser(data_user);
        setCart(data_user.shopping_Cart);
      }

      const defaultCard = {
        card_name: "Default",
        card_number: data_user?.credit_Card,
        expiration_date: "01/2025",
        cvv: "123",
      };

      if (saved_cards) {
        if (saved_cards.length == 0) setCards([defaultCard]);
        else {
          setCards(saved_cards);
        }
      } else {
        setCards([defaultCard]);
      }
    };
    initialize();
  }, []);

  useEffect(() => {
    if (cards.length > 0) {
      localStorage.setItem("cards", JSON.stringify(cards));
    }
  }, [cards]);

  const handleDeliveryDay = (date) => {
    setForm({
      ...form,
      delivery_day: date,
    });
    if (date.length < 1) {
      setDelivery_dayAlert(true);
    } else {
      setDelivery_dayAlert(false);
    }
  };

  const handleDeliveryTime = (date) => {
    setForm({
      ...form,
      delivery_time: date,
    });
    if (date.length < 1) {
      setDelivery_timeAlert(true);
    } else {
      setDelivery_timeAlert(false);
    }
  };

  const handleAddress = (e) => {
    setForm({
      ...form,
      address: e.target.value,
    });
    if (e.target.value.length < 1) {
      setAddressAlert(true);
    } else {
      setAddressAlert(false);
    }
  };

  const handleAddress2 = (e) => {
    setForm({
      ...form,
      address2: e.target.value,
    });
    if (e.target.value.length < 1) {
      setAddress2Alert(true);
    } else {
      setAddress2Alert(false);
    }
  };

  const handleCity = (e) => {
    setForm({
      ...form,
      city: e.target.value,
    });
    if (e.target.value.length < 1) {
      setCityAlert(true);
    } else {
      setCityAlert(false);
    }
  };

  const handleCountry = (e) => {
    setForm({
      ...form,
      country: e.target.value,
    });
    if (e.target.value.length < 1) {
      setCountryAlert(true);
    } else {
      setCountryAlert(false);
    }
  };

  const handleZipCode = (e) => {
    setForm({
      ...form,
      zip_code: e.target.value,
    });
    if (e.target.value.length < 1) {
      setZip_codeAlert(true);
    } else {
      setZip_codeAlert(false);
    }
  };

  const handleCard = (idx) => {
    setForm({
      ...form,
      card: idx,
    });
    if (idx == -1) {
      setCardAlert(true);
    } else {
      setCardAlert(false);
    }
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    console.log(form);

    if (form.delivery_time.length < 1) {
      setDelivery_timeAlert(true);
    } else {
      setDelivery_timeAlert(false);
    }
    if (form.delivery_day.length < 1) {
      setDelivery_dayAlert(true);
    } else {
      setDelivery_dayAlert(false);
    }
    if (form.address.length < 1) {
      setAddressAlert(true);
    } else {
      setAddressAlert(false);
    }
    if (form.address2.length < 1) {
      setAddress2Alert(true);
    } else {
      setAddress2Alert(false);
    }
    if (form.city.length < 1) {
      setCityAlert(true);
    } else {
      setCityAlert(false);
    }
    if (form.country.length < 1) {
      setCountryAlert(true);
    } else {
      setCountryAlert(false);
    }
    if (form.zip_code.length < 1) {
      setZip_codeAlert(true);
    } else {
      setZip_codeAlert(false);
    }
    if (form.card == -1) {
      setCardAlert(true);
    } else {
      setCardAlert(false);
    }

    if (
      form.delivery_time.length < 1 ||
      form.address.length < 1 ||
      form.address2.length < 1 ||
      form.city.length < 1 ||
      form.country.length < 1 ||
      form.zip_code.length < 1 ||
      form.card == -1 ||
      form.delivery_day.length < 1
    ) {
      return;
    } else {
      try {
        axios
          .post(
            `${API_BASE_URL}/user/requestCurrentCart?userID=${user.id}&token=${username.token}`
          )
          .then((res) => {
            if (res.status === 200) {
              console.log("Order placed successfully");
              console.log(res.data);
            }
          });

        navigate("/user");
      } catch (e) {
        console.log(e);
      }
    }
  };

  console.log("User ->", user);
  console.log("Cart -> ", cart);
  console.log("Cards -> ", cards);

  return (
    <div className="bg-base-200">
      <Navbar />
      <div className="mx-[5%] flex justify-between">
        <form
          id="delivery-info"
          className="w-[65%] flex flex-col justify-evenly mx-4"
        >
          <div className="flex flex-col bg-base-100 rounded-lg shadow-xl p-4 my-6">
            <span className="flex align-text-bottom">
              <h1 className=" rounded-full h-10 w-10 bg-primary p-2 text-center">
                1
              </h1>
              <h1 className="font-bold text-xl ml-4 align-text-bottom">
                Delivery Information
              </h1>
            </span>
            <div className="m-4 flex justify-evenly">
              <div className="flex flex-col justify-center w-1/2">
                {delivery_dayAlert && (
                  <Warning msg="Please select a valid delivery day" />
                )}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Delivery Day"
                    format="DD/MM/YYYY"
                    onChange={(date) => handleDeliveryDay(date)}
                  />
                </LocalizationProvider>
              </div>

              <div className="flex flex-col justify-center w-1/2">
                {delivery_timeAlert && (
                  <Warning msg="Please select a valid delivery time" />
                )}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="Delivery Time"
                    ampm={false}
                    onChange={(date) => handleDeliveryTime(date)}
                  />
                </LocalizationProvider>
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-base-100 rounded-lg shadow-xl p-4">
            <span className="flex align-text-bottom">
              <h1 className=" rounded-full h-10 w-10 bg-primary p-2 text-center">
                2
              </h1>
              <h1 className="font-bold text-xl ml-4 align-text-bottom">
                Delivery Address
              </h1>
            </span>
            <div>
              <div className="flex flex-wrap m-2">
                <span className="flex flex-col w-full">
                  <label className="font-bold" htmlFor="address">
                    Address
                  </label>
                  {(addressAlert || address2Alert) && (
                    <Warning msg="Please insert a valid address" error />
                  )}
                  <input
                    id="address"
                    className="input input-bordered w-full"
                    type="text"
                    placeholder="Street address or P.O. box"
                    onChange={(e) => handleAddress(e)}
                  />
                </span>
                <span className="flex flex-col w-full my-1">
                  <input
                    id="address2"
                    className="input input-bordered"
                    type="text"
                    placeholder="Apt, suite, unit, building, floor, etc."
                    onChange={(e) => handleAddress2(e)}
                  />
                </span>
                <div className="flex flex-row justify-between w-full mt-2">
                  <span className="flex flex-col">
                    {cityAlert && <Warning msg="Please enter a city" error />}
                    <input
                      id="city"
                      className="input input-bordered"
                      type="text"
                      placeholder="City"
                      onChange={(e) => handleCity(e)}
                    />
                  </span>
                  <span className="flex flex-col">
                    {countryAlert && (
                      <Warning msg="Please enter a country" error />
                    )}
                    <input
                      id="country"
                      className="input input-bordered"
                      type="text"
                      placeholder="Country"
                      onChange={(e) => handleCountry(e)}
                    />
                  </span>
                  <span className="flex flex-col">
                    {zip_codeAlert && (
                      <Warning msg="Please insert a zip code" error />
                    )}

                    <input
                      id="zip_code"
                      className="input input-bordered"
                      type="text"
                      onChange={(e) => handleZipCode(e)}
                      placeholder="Zip Code"
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col bg-base-100 rounded-lg shadow-xl p-4 my-6">
            <span className="flex align-text-bottom">
              <h1 className=" rounded-full h-10 w-10 bg-primary p-2 text-center">
                3
              </h1>
              <h1 className="font-bold text-xl ml-4 align-text-bottom">
                Payment Details
              </h1>
            </span>
            <div className="flex flex-wrap justify-evenly m-2">
              <span className="flex flex-col my-2 w-[48%]">
                <input
                  id="card"
                  className="input input-bordered"
                  type="text"
                  placeholder="Card Name"
                  onChange={(e) => {
                    setNewCard({
                      ...newCard,
                      card_name: e.target.value,
                    });
                  }}
                />
              </span>
              <span className="flex flex-col my-2 w-[48%]">
                <input
                  id="card_number"
                  className="input input-bordered"
                  type="text"
                  placeholder="Card Number"
                  onChange={(e) => {
                    setNewCard({
                      ...newCard,
                      card_number: e.target.value,
                    });
                  }}
                />
              </span>
              <span className="flex flex-col my-2">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    id="expiration_date"
                    label="Expiration Date"
                    format="MM/YYYY"
                    views={["month", "year"]}
                    onChange={(date) => {
                      setNewCard({
                        ...newCard,
                        expiration_date: date.format("MM/YYYY"),
                      });
                    }}
                  />
                </LocalizationProvider>
              </span>
              <span className="flex flex-col my-2">
                <input
                  id="cvv"
                  className="input input-bordered"
                  type="text"
                  placeholder="CVC/CVV"
                  onChange={(e) => {
                    setNewCard({
                      ...newCard,
                      cvv: e.target.value,
                    });
                  }}
                />
              </span>
              <button
                className="btn btn-primary my-2 w-1/4"
                type="button"
                onClick={() => {
                  setCards([...cards, newCard]);
                  setNewCard({
                    card_name: "",
                    card_number: "",
                    expiration_date: "",
                    cvv: "",
                  });
                }}
              >
                Add Card
              </button>
            </div>
            {cardAlert && <Warning msg="Please select a card" error />}
            <div className="flex flex-wrap justify-start my-2">
              {cards?.map((card, idx) => (
                <div
                  key={idx}
                  className={`card w-[30%]  flex flex-row m-2 ${
                    form.card === idx
                      ? "border-2 border-accent bg-secondary"
                      : "bg-base-200"
                  }`}
                  onClick={() => handleCard(idx)}
                >
                  <div className="card-body flex justify-between w-full ">
                    <h1 className="flex flex-row">
                      <RiBankCardLine className="text-2xl" />
                      <span className="font-bold card-title mx-2">
                        {card.card_name}
                      </span>
                    </h1>
                    <span>{maskCreditCard(card.card_number)}</span>
                    <span>{card.expiration_date}</span>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="btn btn-primary my-2 w-full"
              type="submit"
              onClick={handleCheckout}
            >
              Place Order
            </button>
          </div>
        </form>

        <div className="w-[35%] m-4">
          <h1 className="font-bold text-lg">Your order </h1>
          {cart.map((item) => (
            <div key={item.id} className="flex flex-row justify-between m-4">
              <div className="flex justify-between w-full ">
                <h1>
                  <span className="font-bold ">{item.quantity}x</span>{" "}
                  {item.prod.name}
                </h1>
                <span>{item.prod.price * item.quantity}€</span>
              </div>
            </div>
          ))}
          <div className="divider" />
          <div className="flex flex-col m-4 text-accent">
            <span className="flex justify-between my-2 mt-0">
              <h1 className="font-bold">Subtotal</h1>
              {cart
                .reduce((acc, item) => acc + item.prod.price * item.quantity, 0)
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
          </div>
          <div className="divider" />
          <div className="flex justify-between m-4">
            <h1 className="font-bold">Total</h1>
            <span>
              {cart
                .reduce((acc, item) => acc + item.prod.price * item.quantity, 0)
                .toFixed(2)}
              €
            </span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
