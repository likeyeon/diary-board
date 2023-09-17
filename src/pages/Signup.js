import "../styles/member.scss";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { Link } from "react-router-dom";
import { AuthSignup } from "../apis/AuthApi";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    validateCriteriaMode: "all",
  });

  const onSubmit = async (data) => {
    await AuthSignup(data);
    navigate("/members/login");
  };

  const emailRules = register("email", {
    required: "Email ID를 입력해주세요",
  });

  const nicknameRules = register("nickname", {
    required: "닉네임을 입력해주세요",
    minLength: {
      value: 2,
      message: "닉네임은 최소 2글자 이상이어야 합니다.",
    },
    maxLength: {
      value: 8,
      message: "닉네임은 최대 8글자 이하이어야 합니다.",
    },
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

  const confirmPasswordRules = register("password_confirm", {
    validate: (value, formValues) => {
      return value === formValues.password || "비밀번호가 일치하지 않습니다.";
    },
  });

  return (
    <div className="form-wrapper">
      <div className="form-wrapperInner">
        <h1 className="title">회원가입</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="inputField">
            <input {...emailRules} type="email" placeholder="이메일" />
            <h6 className="message">
              <ErrorMessage errors={errors} name="email">
                {({ message }) => <p>{message}</p>}
              </ErrorMessage>
            </h6>
          </div>

          <div className="inputField">
            <input {...nicknameRules} type="text" placeholder="닉네임" />
            <h6 className="message">
              <ErrorMessage errors={errors} name="nickname">
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

          <div className="inputField">
            <input
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

          <div className="inputField">
            <input
              type="password"
              placeholder="비밀번호 확인"
              autoComplete="off"
              {...confirmPasswordRules}
            />
            <h6 className="message">
              <ErrorMessage errors={errors} name="password_confirm">
                {({ message }) => <p>{message}</p>}
              </ErrorMessage>
            </h6>
          </div>
          <button type="submit" className="form-button">
            회원가입
          </button>
          <div className="form-link">
            <Link to="/members/login" className="form-link">
              로그인하러 가기
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
