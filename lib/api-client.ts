import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, 
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Phiên làm việc hết hạn. Đang chuyển hướng...');
      // Dùng window.location.href để đảm bảo tải lại trang và xóa state cũ
      window.location.href = '/sign-in';
    }
    return Promise.reject(error);
  }
);

export default api;