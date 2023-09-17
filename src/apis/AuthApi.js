import axios from "axios";

export const AuthSignup = async (data) => {
  const response = await axios.post("http://localhost:8080/signup", {
    email: data.email,
    password: data.password,
    nickname: data.nickname,
  });
  return response.data;
};

export const AuthLogin = async (data) => {
  const response = await axios.post("http://localhost:8080/login", {
    email: data.email,
    password: data.password,
  });
  return response.data;
};
