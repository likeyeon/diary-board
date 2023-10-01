import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useSelector } from "react-redux";
import { updateAuth, isAuth, logoutAuth, deleteAuth } from "../utils/AuthApi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useCookies } from "react-cookie";

const Profile = () => {
  const accessToken = useSelector((state) => state.Auth.accessToken);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [, , removeCookie] = useCookies(["refreshToken"]);

  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    validateCriteriaMode: "all",
  });

  useEffect(() => {
    const fetchNickname = async () => {
      const defaultNickname = await isAuth(accessToken);
      // defaultNickname 값이 존재할 때만 실행
      if (defaultNickname) {
        reset({
          nickname: defaultNickname,
        });
        setLoading(false);
      }
    };
    fetchNickname();
  }, []);

  const onSubmit = async (data) => {
    await updateAuth(accessToken, data);
  };

  const logoutMember = () => {
    logoutAuth(dispatch, removeCookie, navigate);
  };

  const deleteMember = async () => {
    deleteAuth(accessToken, navigate);
  };

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

  const newPasswordRules = register("newPassword", {
    required: "새 비밀번호를 입력해주세요",
    minLength: {
      value: 4,
      message: "비밀번호는 최소 4글자 이상이어야 합니다.",
    },
    maxLength: {
      value: 20,
      message: "비밀번호는 최대 20글자 이하이어야 합니다.",
    },
  });

  const confirmNewPasswordRules = register("newPassword_confirm", {
    validate: (value, formValues) => {
      return (
        value === formValues.newPassword || "새 비밀번호가 일치하지 않습니다."
      );
    },
  });
  if (loading) return <div>Loading...</div>;
  else
    return (
      <div className="form-wrapper">
        <div className="form-wrapperInner">
          <div className="form__title--group">
            <h1 className="form__title">프로필 설정</h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <div className="form-block">
              <h3 className="form__title--middle">닉네임</h3>
              <div className="inputField">
                <input
                  {...nicknameRules}
                  type="text"
                  placeholder="닉네임"
                  className="members_input"
                />
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
            </div>

            <div className="form-block">
              <h3 className="form__title--middle">비밀번호</h3>

              <div className="inputField">
                <input
                  className="members_input"
                  type="password"
                  placeholder="새 비밀번호"
                  autoComplete="off"
                  {...newPasswordRules}
                />
                <h6 className="message">
                  <ErrorMessage errors={errors} name="newPassword">
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
                  className="members_input"
                  type="password"
                  placeholder="새 비밀번호 확인"
                  autoComplete="off"
                  {...confirmNewPasswordRules}
                />
                <h6 className="message">
                  <ErrorMessage errors={errors} name="newPassword_confirm">
                    {({ message }) => <p>{message}</p>}
                  </ErrorMessage>
                </h6>
              </div>
            </div>

            <button type="submit" className="form-button">
              저장하기
            </button>
          </form>

          <div className="form-block account-management">
            <h3 className="form__title--middle">계정관리</h3>
            <div className="account-management__buttons">
              <button
                className="account-management__buttons__item--logout"
                onClick={logoutMember}
              >
                로그아웃
              </button>
              <button
                className="account-management__buttons__item--delete"
                onClick={deleteMember}
              >
                회원탈퇴
              </button>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Profile;
