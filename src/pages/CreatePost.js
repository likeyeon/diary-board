import axios from "axios";
import { useForm } from "react-hook-form";
import { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import chevronLeft from "../assets/chevron-left.svg";
import "../styles/post-form.scss";

const CreatePost = () => {
  const navigate = useNavigate();

  const { register, setValue, getValues, handleSubmit } = useForm({
    defaultValues: {
      title: "",
      content: "",
      created_at: "",
      updated_at: "",
      member_id: "",
    },
  });

  const getCurrentTime = useCallback(() => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const currentTime = new Date();
    const currentYear = currentTime.getFullYear();
    const currentMonth = String(currentTime.getMonth() + 1).padStart(2, "0");
    const currentDate = String(currentTime.getDate()).padStart(2, "0");
    const currentDay = days[currentTime.getDay()];
    const currentHour = String(currentTime.getHours()).padStart(2, "0");
    const currentMinute = currentTime.getMinutes();

    return `${currentYear}-${currentMonth}-${currentDate}(${currentDay}) ${currentHour}:${currentMinute}`;
  }, []);

  const onSubmit = useCallback(async () => {
    try {
      setValue("updated_at", getCurrentTime());
      setValue("created_at", getCurrentTime());
      setValue("member_id", Math.floor(Math.random() * 10)); //임시 랜덤번호 설정
      const response = await axios.post(
        "http://localhost:8080/posts",
        getValues()
      );
      navigate("/posts");
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  }, [getCurrentTime, getValues, setValue, navigate]);

  return (
    <div className="postForm-wrapper">
      <div className="postForm-previous">
        <img
          className="postForm-previous__icon"
          src={chevronLeft}
          alt="chevron-left"
        />
        <Link to={"/posts"} className="postForm-previous__text">
          돌아가기
        </Link>
      </div>
      <div className="postForm-form-wrapper">
        <form
          method="post"
          className="postForm-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            type="text"
            {...register("title", { required: true })}
            className="postForm-form__title"
          />
          <div className="postForm-form__contents">
            <textarea
              className="postForm-form__textarea"
              {...register("content", { required: true })}
            />
            <div className="postForm-form__imageFile">
              <input
                type="file"
                id="chooseImg"
                name="chooseImg"
                accept="image/*"
              />
            </div>
          </div>
          <button type="submit" className="postForm-form__btn">
            작성완료
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
