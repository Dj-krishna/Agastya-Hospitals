import axios from "axios";
import {
  LOGIN_URL,
  DOCTORS_API,
  USER_ROLES_API,
  USERS_API,
  MODULES_API,
  DEPARTMENTS_API,
  SPECIALITIES_API_DROPDOWN,
  SPECIALITIES_API,
  SPECIALITY_BY_ID_API,
  APPOINTMENTS_API,
  PATIENTS_API,
  HEALTH_PACKAGES_API,
} from "./index";

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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
      localStorage.removeItem("token");
      localStorage.removeItem("userDetails");
      localStorage.removeItem("login");
      window.location.href = "/login";
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

export const fetchDataPut = async (url, data, options = {}) => {
  try {
    const response = await axios.put(url, data, options);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(LOGIN_URL, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Speciality CRUD API functions
export const fetchSpecialityById = async (id) => {
  try {
    const response = await axios.get(`${SPECIALITY_BY_ID_API}?specialityID=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching speciality by ID:", error);
    throw error;
  }
};

export const createSpeciality = async (specialityData) => {
  try {
    const formData = new FormData();
    
    // Add all form fields to FormData
    Object.keys(specialityData).forEach(key => {
      if (specialityData[key] !== null && specialityData[key] !== undefined) {
        if (key === 'icon' && specialityData[key] instanceof File) {
          formData.append(key, specialityData[key]);
        } else if (key === 'banner' && specialityData[key] instanceof File) {
          formData.append(key, specialityData[key]);
        } else if (Array.isArray(specialityData[key])) {
          // Convert arrays to JSON strings
          formData.append(key, JSON.stringify(specialityData[key]));
        } else {
          formData.append(key, specialityData[key]);
        }
      }
    });

    const response = await axios.post(SPECIALITIES_API, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating speciality:", error);
    throw error;
  }
};

export const updateSpeciality = async (id, specialityData) => {
  try {
    const formData = new FormData();
    
    // Add all form fields to FormData
    Object.keys(specialityData).forEach(key => {
      if (specialityData[key] !== null && specialityData[key] !== undefined) {
        if (key === 'icon' && specialityData[key] instanceof File) {
          formData.append(key, specialityData[key]);
        } else if (key === 'banner' && specialityData[key] instanceof File) {
          formData.append(key, specialityData[key]);
        } else if (Array.isArray(specialityData[key])) {
          // Convert arrays to JSON strings
          formData.append(key, JSON.stringify(specialityData[key]));
        } else {
          formData.append(key, specialityData[key]);
        }
      }
    });

    const response = await axios.put(
      `${SPECIALITY_BY_ID_API}?specialityID=${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating speciality:", error);
    throw error;
  }
};

export const deleteSpeciality = async (id) => {
  try {
    const response = await axios.delete(`${SPECIALITY_BY_ID_API}?specialityID=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting speciality:", error);
    throw error;
  }
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
    const formData = new FormData();
    
    // Add all form fields to FormData
    Object.keys(doctorData).forEach(key => {
      if (doctorData[key] !== null && doctorData[key] !== undefined) {
        if (key === 'profilePicture' && doctorData[key] instanceof File) {
          formData.append(key, doctorData[key]);
        } else if (Array.isArray(doctorData[key])) {
          // Convert arrays to JSON strings
          formData.append(key, JSON.stringify(doctorData[key]));
        } else {
          formData.append(key, doctorData[key]);
        }
      }
    });

    const response = await axios.post(DOCTORS_API, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
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
    const formData = new FormData();
    
    // Add all form fields to FormData
    Object.keys(doctorData).forEach(key => {
      if (doctorData[key] !== null && doctorData[key] !== undefined) {
        if (key === 'profilePicture' && doctorData[key] instanceof File) {
          formData.append(key, doctorData[key]);
        } else if (Array.isArray(doctorData[key])) {
          // Convert arrays to JSON strings
          formData.append(key, JSON.stringify(doctorData[key]));
        } else {
          formData.append(key, doctorData[key]);
        }
      }
    });

    const response = await axios.put(
      `${DOCTORS_API}?doctorID=${id}`, // Use query param instead of path param
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("DOCTOR response  ", response);
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

// User Roles CRUD API functions
export const fetchUserRoleById = async (id) => {
  try {
    const response = await axios.get(`${USERS_API}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user role by ID:", error);
    throw error;
  }
};

export const createUserRole = async (userRoleData) => {
  try {
    const response = await axios.post(USERS_API, userRoleData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating user role:", error);
    throw error;
  }
};

export const updateUserRole = async (id, userRoleData) => {
  try {
    console.log("updateUserRequest", userRoleData);
    const response = await axios.put(
      `${USERS_API}?userID=${id}`, // Use query param instead of path param
      userRoleData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUserRole = async (id) => {
  try {
    const response = await axios.delete(`${USER_ROLES_API}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user role:", error);
    throw error;
  }
};

// Department and Speciality API functions
export const fetchDepartments = async () => {
  try {
    const response = await axios.get(DEPARTMENTS_API);
    return response.data;
  } catch (error) {
    console.error("Error fetching departments:", error);
    throw error;
  }
};

export const fetchSpecialities = async () => {
  try {
    const response = await axios.get(SPECIALITIES_API_DROPDOWN);
    return response.data;
  } catch (error) {
    console.error("Error fetching specialities:", error);
    throw error;
  }
};

export const appointmentsCount = async (date) => {
  const response = await axios.get(APPOINTMENTS_API);
  return {
    totalAppointments: response.data.count,
    cancelledAppointments: response.data.appointments.filter(
      (appointment) => appointment.status === "cancelled"
    ).length,
  };
};

// Medical Records Upload API function
export const uploadMedicalRecords = async (patientID, files) => {
  try {
    const formData = new FormData();
    
    // Append all files to FormData
    files.forEach((file) => {
      formData.append('medicalRecords', file);
    });

    const response = await axios.put(
      `${PATIENTS_API}?patientID=${patientID}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading medical records:", error);
    throw error;
  }
};

export const deleteHealthPackage = async (id) => {
  try {
    const response = await axios.delete(`${HEALTH_PACKAGES_API}?packageID=${id}`);
    return response.data.message;
  } catch (error) {
    console.error("Error deleting user role:", error);
    throw error;
  }
};