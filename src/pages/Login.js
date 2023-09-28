import "../styles/member.scss";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { Link } from "react-router-dom";
import { AuthLogin } from "../utils/AuthApi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useCookies } from "react-cookie";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cookies, setCookie, removeCookie] = useCookies(["refreshToken"]);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    validateCriteriaMode: "all",
  });

  const onSubmit = async (data) => {
    await AuthLogin(data, dispatch, setCookie);
  };

  const emailRules = register("email", {
    required: "Email ID를 입력해주세요",
  });

  const passwordRules = register("password", {
    required: "비밀번호를 입력해주세요",
    minLength: {
      value: 4,
      message: "비밀번호는 최소 4글자 이상이어야 합니다.",
    },
    maxLength: {
      value: 20,
      message: "비밀번호는 최대 20글자 이하이어야 합니다.",
    },
  });

  return (
    <div className="form-wrapper">
      <div className="form-wrapperInner">
        <h1 className="form__title">로그인</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="inputField">
            <input
              {...emailRules}
              type="email"
              placeholder="이메일"
              className="members_input"
            />
            <h6 className="message">
              <ErrorMessage errors={errors} name="email">
                {({ message }) => <p>{message}</p>}
              </ErrorMessage>
            </h6>
          </div>

          <div className="inputField">
            <input
              className="members_input"
              type="password"
              placeholder="비밀번호"
              autoComplete="off"
              {...passwordRules}
            />
            <h6 className="message">
              <ErrorMessage errors={errors} name="password">
                {({ messages }) => {
                  return (
                    messages &&
                    Object.entries(messages).map(([type, message]) => (
                      <p key={type}>{message}</p>
                    ))
                  );
                }}
              </ErrorMessage>
            </h6>
          </div>

          <button type="submit" className="form-button">
            로그인
          </button>
          <div className="form-link">
            <Link to="/" className="form-link">
              비밀번호를 잊어버리셨나요?
            </Link>
            <Link to="/signup" className="form-link">
              아직 회원이 아니신가요?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
