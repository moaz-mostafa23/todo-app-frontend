import { fetchAuthSession } from 'aws-amplify/auth';
import axios, { AxiosError } from 'axios';
import { stringify } from 'qs';
import { toast } from 'react-toastify';

const createAxios = (baseURL: any) => {
  const newInstance = axios.create({
    baseURL: baseURL,
    headers: {
      'Content-Type': 'application/json'
    },

    paramsSerializer: (params) => stringify(params)
  });

  newInstance.interceptors.request.use(
    async (options) => {
      try {
        const session = await fetchAuthSession();
        if (options.headers && session.tokens?.idToken) {
          options.headers['Authorization'] = `Bearer ${session.tokens.idToken.toString()}`;
        }

        return options;
      } catch {
        return {
          ...options,
          cancelToken: new axios.CancelToken((cancel) => cancel())
        };
      }
    },
    (error) => Promise.reject(error)
  );

  newInstance.interceptors.response.use(
    (res) => res,
    (error: AxiosError) => {
      if (error.response && error.response.status === 403) {
        toast((error.response?.data as string) || 'You have no power here', {
          type: 'error'
        });
      } else {
        toast((error.response?.data as string) || 'error', {
          type: 'error'
        });
      }
      return Promise.reject(error);
    }
  );

  return newInstance;
};

const client = createAxios(process.env.REACT_APP_API_BASE_URL);

export default client;
