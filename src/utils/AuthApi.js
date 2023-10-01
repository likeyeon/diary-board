import axios from "axios";
import { setToken } from "../redux/AuthReducer";

/* 회원가입 */
export const AuthSignup = async (data, navigate) => {
  await axios
    .post(`/members`, {
      email: data.email,
      password: data.password,
      nickname: data.nickname,
    })
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
        console.log(error);
      } else {
        console.log(error);
      }
    });
};

/* 로그인 */
export const AuthLogin = async (data, dispatch, setCookie) => {
  await axios
    .post("/members/login", data)
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
        console.log(error);
      } else {
        console.log(error);
      }
    });
};

/* 회원 정보 조회 */
export const isAuth = async (accessToken) => {
  try {
    const response = await axios.get("/members", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.status === 200) {
      return response.data.nickname;
    }
  } catch (error) {
    console.log(error);
  }
};

/* 회원 정보 변경 */
export const updateAuth = async (accessToken, data) => {
  try {
    const response = await axios.patch(
      "/members",
      {
        nickname: data.nickname,
        password: data.newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.status === 200) {
      alert(response.data.message);
    }
  } catch (error) {
    console.log(error);
  }
};
