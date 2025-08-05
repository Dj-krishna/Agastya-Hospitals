import axios from "axios";
import { LOGIN_URL, DOCTORS_API, USER_ROLES_API, MODULES_API } from "./index";

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('userDetails');
      localStorage.removeItem('login');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(LOGIN_URL, credentials, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSpeciality = async (id) => {
  const response = await fetch(`/api/specialities/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      // Add auth headers if needed
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete");
  }
  return response.json();
};

// Doctor-specific API functions
export const fetchDoctorById = async (id) => {
  try {
    const response = await axios.get(`${DOCTORS_API}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createDoctor = async (doctorData) => {
  try {
    const response = await axios.post(DOCTORS_API, doctorData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateDoctor = async (id, doctorData) => {
  try {
    console.log("doctordataend", doctorData);
    const response = await axios.put(
      `${DOCTORS_API}?doctorID=${id}`, // Use query param instead of path param
      doctorData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteDoctor = async (id) => {
  try {
    const response = await axios.delete(`${DOCTORS_API}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Login Types and Modules API functions
export const fetchLoginTypes = async () => {
  try {
    const response = await axios.get(USER_ROLES_API);
    return response.data;
  } catch (error) {
    console.error("Error fetching login types:", error);
  }
};

export const fetchModules = async () => {
  try {
    const response = await axios.get(MODULES_API);
    return response.data;
  } catch (error) {
    console.error("Error fetching modules:", error);
  }
};