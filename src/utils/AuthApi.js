import axios from "axios";
import { setToken } from "../redux/AuthReducer";

export const AuthSignup = async (data, navigate) => {
  await axios
    .post(
      `https://cors-anywhere.herokuapp.com/${process.env.REACT_APP_API_URL}/members`,
      {
        email: data.email,
        password: data.password,
        nickname: data.nickname,
      }
    )
    // 회원가입 성공
    .then(function (response) {
      if (response.status === 200) {
        alert(response.data.message);
        navigate("/login");
      }
    })
    // 회원가입 실패
    .catch(function (error) {
      if (error.response.status === 400 || error.response.status === 409) {
        alert(error.response.data.message);
      } else {
        console.log(error);
      }
    });
};

export const AuthLogin = async (data, dispatch, setCookie) => {
  await axios
    .post(
      `https://cors-anywhere.herokuapp.com/${process.env.REACT_APP_API_URL}/members/login`,
      data
    )
    // 로그인 성공
    .then(function (response) {
      if (response.status === 200) {
        dispatch(setToken(response.data.access_token));
        setCookie("refreshToken", response.data.refresh_token, {
          path: "/",
        });
        console.log(response);

        alert("로그인 성공!");
      }
    })
    // 로그인 실패
    .catch(function (error) {
      if (error.response.status === 400 || error.response.status === 401) {
        alert(error.response.data.message);
      } else {
        console.log(error);
      }
    });
};
