import createHttp from '@/utils/axiosHttp';

const http = createHttp({
  timeout: 10000,
  baseURL: 'api',
  withCredentials: true,
  xsrfCookieName: 'Authorization',
  xsrfHeaderName: 'Authorization',
  headers: {
    'Content-Type': 'application/json', // 设置 Content-Type
    'Accept': 'application/json',       // 设置 Accept
  }
});

export default http;
