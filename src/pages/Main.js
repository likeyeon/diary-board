import { useEffect, useCallback } from "react";
import { getCookie } from "../utils/cookies";
import axios from "axios";
import { setToken } from "../redux/AuthReducer";
import store from "../redux/store";
import jwtDecode from "jwt-decode";

const Main = () => {
  const refreshToken = getCookie("refreshToken");

  const onSilentRefresh = useCallback(() => {
    axios
      .get("/members/reissue", {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      })
      .then((response) => {
        store.dispatch(setToken(response.data.access_token));

        //access token 만료 1분 전, 액세스 토큰 재발급
        const decodedToken = jwtDecode(response.data.access_token);

        const delay = decodedToken.exp * 1000 - Date.now() - 120 * 1000;
        setTimeout(onSilentRefresh, delay);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [refreshToken]);

  useEffect(() => {
    if (refreshToken) onSilentRefresh();
  }, [refreshToken, onSilentRefresh]);

  return <div>main</div>;
};

export default Main;
