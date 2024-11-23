import axios from 'axios';
import isNull from 'lodash-es/isNull';
import isUndefined from 'lodash-es/isUndefined';
import omitBy from 'lodash-es/omitBy';
import { isArray } from 'lodash-es';
import { siteConfig } from '@/config/siteconfig';

// Helper function to construct URL query parameters
const buildQueryString = (data) => {
  let query = '';
  const dataLength = Object.keys(data).length;

  if (dataLength > 0) {
    Object.keys(data).forEach((key, index) => {
      const separator = index === dataLength - 1 ? '' : '&';
      query += `${encodeURIComponent(key)}=${encodeURIComponent(String(data[key]))}${separator}`;
    });
  }

  return query ? `?${query}` : '';
};

async function getApiData(
  url = '',
  data = {},
  method = 'GET',
  customUrl = false,
  headers = {},
  formData = false,
) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const mergedHeaders = {
    ...defaultHeaders,
    ...headers,
    api_type: 'web',
  };

  const validMethods = ['get', 'post', 'put', 'delete'];
  const methodParam = validMethods.includes(method.toLowerCase()) ? method.toLowerCase() : 'get';

  const cleanedData = !formData ? omitBy(data, (v) => isUndefined(v) || isNull(v)) : data;
  const queryString = method === 'GET' ? buildQueryString(cleanedData) : '';

  try {
    const response = await axios({
      method: methodParam,
      url: customUrl ? url : `${siteConfig.apiUrl}${url}${queryString}`,
      headers: mergedHeaders,
      data: cleanedData,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        status: error.response?.data?.status,
        message: error.response?.data?.message,
      };
    }
    console.error('API Request Error:', error);
    return null;
  }
}

// Function to handle API progress (for file uploads, etc.)
export function getAPIProgressData(endpoint, method, data, onProgress = () => {}) {
  const isOnline = window.navigator.onLine;
  if (!isOnline) {
    return Promise.reject(new Error('No internet connection.'));
  }

  const url = `${siteConfig.apiUrl}${endpoint}`;
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (isArray(value) && value.length > 0) {
      value.forEach((item) => formData.append(key, String(item)));
    } else {
      formData.append(key, String(value));
    }
  });

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    if (!['POST', 'PUT'].includes(method.toUpperCase())) {
      reject(new Error(`Invalid HTTP method: ${method}`));
      return;
    }

    xhr.open(method, url, true);

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded * 100) / event.total;
        onProgress(progress);
      }
    });

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`Request failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network Error'));
    xhr.send(formData);
  });
}

export default getApiData;
