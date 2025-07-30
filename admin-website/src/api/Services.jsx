import axios from "axios";

export const fetchDataGet = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    // Handle error as needed
    throw error;
  }
};

export const fetchDataPost = async (url, data, options = {}) => {
  try {
    const response = await axios.post(url, data, options);
    return response.data;
  } catch (error) {
    // Handle error as needed
    throw error;
  }
};

