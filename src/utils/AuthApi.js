import axios from "axios";
import { setToken } from "../redux/AuthReducer";
import api from "../utils/api";
import store from "../redux/store";
import jwtDecode from "jwt-decode";

/* 회원가입 */
export const AuthSignup = async (data, navigate) => {
  await axios
    .post(process.env.REACT_APP_DB_HOST + `/members`, {
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
export const AuthLogin = async (
  data,
  dispatch,
  setCookie,
  state,
  navigate,
  onSilentRefresh
) => {
  await axios
    .post(process.env.REACT_APP_DB_HOST + "/members/login", data)
    // 로그인 성공
    .then(function (response) {
      if (response.status === 200) {
        dispatch(setToken(response.data.access_token));
        setCookie("refreshToken", response.data.refresh_token, {
          path: "/",
        });

        const decodedToken = jwtDecode(response.data.access_token);
        const delay = decodedToken.exp * 1000 - Date.now() - 60 * 1000;
        setTimeout(onSilentRefresh, delay);

        alert("로그인 성공!");
        console.log(response);

        state ? navigate(state) : navigate("/board");
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
export const isAuth = async () => {
  try {
    const response = await api.get("/members");
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
      process.env.REACT_APP_DB_HOST + "/members",
      data,
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
    alert(error.response.data.message);
  }
};

/* 로그아웃 */
export const logoutAuth = (dispatch, removeCookie, navigate) => {
  dispatch({ type: "REMOVE_TOKEN" });
  removeCookie("refreshToken", {
    path: "/",
  });
  alert("로그아웃 되었습니다.");
  navigate("/login");
};

/* 회원탈퇴 */
export const deleteAuth = async (accessToken, removeCookie, navigate) => {
  try {
    const response = await axios.delete(
      process.env.REACT_APP_DB_HOST + "/members",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    store.dispatch({ type: "REMOVE_TOKEN" });
    removeCookie("refreshToken", {
      path: "/",
    });
    if (response.status === 200) {
      alert(response.data.message);
      navigate("/board");
    }
  } catch (error) {
    console.log(error);
  }
};
