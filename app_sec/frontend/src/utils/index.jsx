import axios from 'axios';
import { API_BASE_URL } from '../constants';

const fetchData = async (endpoint) => {
  try {
    const res = await axios.get(`${API_BASE_URL}${endpoint}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const postData = async (endpoint, data) => {
  try {
    const res = await axios.post(`${API_BASE_URL}${endpoint}`, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${
    remainingSeconds.toFixed(0) < 10 ? '0' : ''
  }${remainingSeconds.toFixed(0)}`;
};

const getUrlParams = () => {
  return new URLSearchParams(window.location.search);
};

export { fetchData, getUrlParams, postData, formatTime };