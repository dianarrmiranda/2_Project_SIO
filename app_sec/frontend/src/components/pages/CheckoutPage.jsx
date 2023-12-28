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
import useAuth from "../../hooks/useAuth";

import { fetchData } from "../../utils";
import { maskCreditCard } from "../../utils";
import { API_BASE_URL } from "../../constants";
import Warning from "../layout/Warning";
import { Autocomplete, TextField } from "@mui/material";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const username = auth?.user;
  const acessToken = auth?.acessToken;
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

  const [countries, setCountries] = useState([]);
  const [addressValidAlert, setAddressValidAlert] = useState(false);

  const [cvcAlert, setCvcAlert] = useState(false);
  const [cardNameAlert, setCardNameAlert] = useState(false);
  const [cardNumberAlert, setCardNumberAlert] = useState(false);
  const [expirationDateAlert, setExpirationDateAlert] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      const saved_cards = JSON.parse(localStorage.getItem("cards"));
      const data_user = await fetchData(
        `/user/view?id=${username.id}&token=${acessToken}`
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

      fetch('https://restcountries.com/v3.1/all?fields=name')
      .then(response => response.json())
      .then(data => {
        const countries = data.map((country) => country.name.common);
        setCountries(countries);
      });

      console.log("User ->", user);
      console.log("Cart -> ", cart);
      console.log("Cards -> ", cards);

    };
    initialize();
  }, []);

  useEffect(() => {
    if (cards.length > 0) {
      localStorage.setItem("cards", JSON.stringify(cards));
    }
  }, [cards]);

  const handleDeliveryDay = (date) => {
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (date.format("DD/MM/YYYY").length < 1 || !dateRegex.test(date.format("DD/MM/YYYY"))) {
      setDelivery_dayAlert(true);
    } else {
      setForm({
        ...form,
        delivery_day: date.format("DD/MM/YYYY"),
      });
      setDelivery_dayAlert(false);
    }
  };

  const handleDeliveryTime = (date) => {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (date.format("HH:mm") < 1 || !timeRegex.test(date.format("HH:mm"))) {
      setDelivery_timeAlert(true);
    } else {
      setForm({
        ...form,
        delivery_time: date.format("HH:mm"),
      });
      setDelivery_timeAlert(false);
    }
  };

  const handleAddress = (e) => {
    const addressRegex = /^[A-Za-z0-9'\.\-\s\,]+$/;
    const poBoxRegex = /^PO Box \d+$/;

    if (e.target.value.length < 1 || !addressRegex.test(e.target.value) || poBoxRegex.test(e.target.value)) {
      setAddressAlert(true);
    } else {
      setForm({
        ...form,
        address: e.target.value,
      });
      setAddressAlert(false);
    }
  };

  const handleAddress2 = (e) => {
    const addressPartRegex = /^[A-Za-z0-9'\.\-\s\,]+$/;
    
    if (e.target.value.length < 1 || !addressPartRegex.test(e.target.value)) {
      setAddress2Alert(true);
    } else {
      setForm({
        ...form,
        address2: e.target.value,
      });
      setAddress2Alert(false);
    }
  };

  const handleCity = (e) => {
    const cityRegex = /^[\s\S]*$/u;

    if (e.target.value.length < 1 || !cityRegex.test(e.target.value)) {
      setCityAlert(true);
    } else {
      setForm({
        ...form,
        city: e.target.value,
      });
      setCityAlert(false);
    }
  };

  const handleCountry = (event, value) => {
    const countryRegex = /^[\s\S]*$/u;
    if (value.length < 1 || !countryRegex.test(value)) {
      setCountryAlert(true);
    } else {
      setForm({
        ...form,
        country: value,
      });
      setCountryAlert(false);
    }
  };

  const handleZipCode = (e) => {
    const postalCodeRegex = /^\d+-?\d+$/;

    if (e.target.value.length < 1 || !postalCodeRegex.test(e.target.value)) {
      setZip_codeAlert(true);
    } else {
      setForm({
        ...form,
        zip_code: e.target.value,
      });
      setZip_codeAlert(false);
    }
  };

  const verifyLocation = async () => {

    let zc = form.zip_code;
    if (form.zip_code.includes('-')) {
      zc = form.zip_code.split('-')[0];
    }
    const cit = form.city;
    const c = form.country;
    const address = `${zc} ${cit} ${c}`;
    const apiKey = 'AIzaSyBFkLDRwb7tal8NXKkU397FDRFQFtXTaM0'; 
    
    let control = []
    let valid = true;
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`);
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        for (let i = 0; i < data.results[0].address_components.length; i++) {
          if (data.results[0].address_components[i].types.includes('postal_code')) {
            if (data.results[0].address_components[i].long_name != zc) {
              valid = false;
            } 
          }
          if (data.results[0].address_components[i].types.includes('country')) {
            if (data.results[0].address_components[i].long_name.toLowerCase() != c.toLowerCase()) {
              valid = false;
            }
          }
          if (data.results[0].address_components[i].types.includes('locality')) {
            if (data.results[0].address_components[i].long_name.toLowerCase() != cit.toLowerCase()) {
              valid = false;
            } 
          }
          control.push(...data.results[0].address_components[i].types.map((type) => type));
        }
        
        if (!control.includes('postal_code') || !control.includes('country') || !control.includes('locality')) {
          valid = false;
        } 
        setAddressValidAlert(!valid);
      } else {
        console.error('Geocoding failed:', data.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChangeCVC = (e) => {
    const cvcRegex = /^\d{3}$/;
    if (e.target.value.length < 1 || !cvcRegex.test(e.target.value)) {
      setCvcAlert(true);
    } else {
      setNewCard({
        ...newCard,
        cvv: e.target.value,
      });
      setCvcAlert(false);
    }
  };

  const handleChangeCardName = (e) => {
    const cardNameRegex = /^[A-Za-z\s]+$/;
    if (e.target.value.length < 1 || !cardNameRegex.test(e.target.value)) {
      setCardNameAlert(true);
    } else {
      setNewCard({
        ...newCard,
        card_name: e.target.value,
      });
      setCardNameAlert(false);
    }
  };

  const handleChangeCardNumber = (e) => {
    const cardNumberRegex = /^\d{16}$/;
    if (e.target.value.length < 1 || !cardNumberRegex.test(e.target.value)) {
      setCardNumberAlert(true);
    } else {
      setNewCard({
        ...newCard,
        card_number: e.target.value,
      });
      setCardNumberAlert(false);
    }
  };

  const handleChangeExpirationDate = (date) => {
    const expirationDateRegex = /^\d{2}\/\d{4}$/;

    if (date.format("MM/YYYY").length < 1 || !expirationDateRegex.test(date.format("MM/YYYY"))) {
      setExpirationDateAlert(true);
    } else {
      const [month, year] = date.format("MM/YYYY").split('/');
      
      if (parseInt(month) > 12) {
        setExpirationDateAlert(true);
      } else {
        const inputDate = new Date(year, month - 1);
        const currentDate = new Date();

        if (inputDate > currentDate) {
          setNewCard({
            ...newCard,
            expiration_date: date.format("MM/YYYY"),
          });
          setExpirationDateAlert(false);
        } else {
          setExpirationDateAlert(true);
        }
      }
    }
   }
  
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

  const handleCheckout = async (e) => {
    e.preventDefault();

    await verifyLocation();

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
      form.delivery_day.length < 1 ||
      addressValidAlert ||
      delivery_dayAlert ||
      delivery_timeAlert ||
      addressAlert ||
      address2Alert ||
      cityAlert ||
      countryAlert ||
      zip_codeAlert ||
      cardAlert ||
      cvcAlert ||
      cardNameAlert ||
      cardNumberAlert ||
      expirationDateAlert
    ) {
      return;
    } else {
      try {
        axios
          .post(
            `${API_BASE_URL}/user/requestCurrentCart?userID=${user.id}&token=${acessToken}`
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

  

  return (
    <div className="bg-base-200">
      <Navbar />
      <div className="mx-[5%] flex justify-between">
        <form
          id="delivery-info"
          className="w-[65%] flex flex-col justify-evenly mx-4"
        >
          <div className="flex flex-col p-4 my-6 rounded-lg shadow-xl bg-base-100">
            <span className="flex align-text-bottom">
              <h1 className="w-10 h-10 p-2 text-center rounded-full bg-primary">
                1
              </h1>
              <h1 className="ml-4 text-xl font-bold align-text-bottom">
                Delivery Information
              </h1>
            </span>
            <div className="flex m-4 justify-evenly">
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
          <div className="flex flex-col p-4 rounded-lg shadow-xl bg-base-100">
            <span className="flex align-text-bottom">
              <h1 className="w-10 h-10 p-2 text-center rounded-full bg-primary">
                2
              </h1>
              <h1 className="ml-4 text-xl font-bold align-text-bottom">
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
                    className="w-full input input-bordered"
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
                    {countryAlert && (
                      <Warning msg="Please enter a country" error />
                    )}
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      sx={{ width: 300 }}
                      options={countries}
                      renderInput={(params) => <TextField {...params} label="Country" />}
                      onChange={handleCountry}
                    />

                  </span>
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
                {addressValidAlert && (
                  <Warning msg="Country, city, and zip code didn't match. Please ensure that the provided information is accurate and corresponds to a valid address." error />
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col p-4 my-6 rounded-lg shadow-xl bg-base-100">
            <span className="flex align-text-bottom">
              <h1 className="w-10 h-10 p-2 text-center rounded-full bg-primary">
                3
              </h1>
              <h1 className="ml-4 text-xl font-bold align-text-bottom">
                Payment Details
              </h1>
            </span>
            <div className="flex flex-wrap m-2 justify-evenly">
              <span className="flex flex-col my-2 w-[48%]">
                <input
                  id="card"
                  className="input input-bordered"
                  type="text"
                  placeholder="Card Name"
                  onChange={handleChangeCardName}
                />
              </span>
              <span className="flex flex-col my-2 w-[48%]">
                <input
                  id="card_number"
                  className="input input-bordered"
                  type="text"
                  placeholder="Card Number"
                  onChange={handleChangeCardNumber}
                />
              </span>
              <span className="flex flex-col my-2">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    id="expiration_date"
                    label="Expiration Date"
                    format="MM/YYYY"
                    views={["month", "year"]}
                    onChange={handleChangeExpirationDate}
                  />
                </LocalizationProvider>
              </span>
              <span className="flex flex-col my-2">
                <input
                  id="cvv"
                  className="input input-bordered"
                  type="text"
                  placeholder="CVC/CVV"
                  onChange={handleChangeCVC}
                />
              </span>
              <button
                className="w-1/4 my-2 btn btn-primary"
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
              {cvcAlert && (
                <Warning msg="Please enter a valid CVC/CVV" error />
              )}
              {cardNameAlert && (
                <Warning msg="Please enter a valid card name" error />
              )}
              {cardNumberAlert && (
                <Warning msg="Please enter a valid card number" error />
              )}
              {expirationDateAlert && (
                <Warning msg="Please enter a valid expiration date" error />
              )}
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
                  <div className="flex justify-between w-full card-body ">
                    <h1 className="flex flex-row">
                      <RiBankCardLine className="text-2xl" />
                      <span className="mx-2 font-bold card-title">
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
              className="w-full my-2 btn btn-primary"
              type="submit"
              onClick={handleCheckout}
            >
              Place Order
            </button>
          </div>
        </form>

        <div className="w-[35%] m-4">
          <h1 className="text-lg font-bold">Your order </h1>
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
