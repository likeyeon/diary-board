// 토큰을 설정하고 제거하는데 사용할 액션 타입
const SET_TOKEN = "SET_TOKEN";
const REMOVE_TOKEN = "REMOVE_TOKEN";

const AuthInitialState = {
  accessToken: null,
};

// 해당 액션 타입에 대한 액션 생성자 함수
export const setToken = (accessToken) => ({
  type: SET_TOKEN,
  payload: accessToken,
});

export const removeToken = () => ({
  type: REMOVE_TOKEN,
});

export const AuthReducer = (state = AuthInitialState, action) => {
  switch (action.type) {
    case SET_TOKEN:
      return {
        ...state,
        accessToken: action.payload,
      };
    case REMOVE_TOKEN:
      return { ...state, accessToken: null };
    default:
      return state;
  }
};
