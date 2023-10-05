import axios from "axios";
import { isAuth } from "./jwtUtils";
import { setToken } from "../redux/AuthReducer";
import store from "../redux/store";
import { logoutAuth } from "../utils/AuthApi";
import { getCookie, removeCookie } from "./cookies";
import { useNavigate } from "react-router-dom";

const instance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
});

// access token 값 획득, 설정 함수
const getAccessToken = () => store.getState().Auth.accessToken;
const setAccessToken = (response) =>
  store.dispatch(setToken(response.data.access_token));

const reissueAccessToken = async (refreshToken) => {
  try {
    const response = await axios.get("/reissue", {
      headers: { Authorization: `Bearer ${refreshToken}` },
    });
    setAccessToken(response);
  } catch (error) {
    console.log(error);
  }
};

/* 1. 요청 인터셉터 */
instance.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken && isAuth(accessToken)) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

/* 2. 응답 인터센터 */
instance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // 토큰이 유효하지 않은 경우 (ex. 기간만료, 이상한 토큰)
    if (error.response.status === 400 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getCookie("refreshToken");

      if (refreshToken) {
        await reissueAccessToken(refreshToken);

        // 재발급 받은 access token으로 header 설정 변경
        originalRequest.headers.Authorization = `Bearer ${getAccessToken()}`;

        return instance(originalRequest); // 원래 요청 다시 보내기
      } else {
        const navigate = useNavigate();
        logoutAuth(removeCookie, navigate); // 리프레시 토큰이 없다면 로그아웃 처리
      }
      // 잘못된 토큰 전송
    } else if (error.response.status === 401 && !originalRequest._retry) {
      console.log(error);
    } else {
      console.log(error);
    }

    return Promise.reject(error);
  }
);

export default instance;
