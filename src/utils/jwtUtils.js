import jwtDecode from "jwt-decode";

// 토큰 유효성 검사
export const isAuth = (accessToken) => {
  // 토큰이 없을 때
  if (!accessToken) {
    return false;
  }
  // 토큰이 만료되었을 때
  const decoded = jwtDecode(accessToken);
  return decoded.exp > new Date().getTime() / 1000;
};

// 토큰에서 유저 id 가져오기
export const getId = (accessToken) => {
  const decoded = jwtDecode(accessToken);
  return decoded.jti;
};
