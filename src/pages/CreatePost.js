import axios from "axios";
import { useForm } from "react-hook-form";
import { useCallback } from "react";
import api from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import chevronLeft from "../assets/chevron-left.svg";
import "../styles/post-form.scss";

const CreatePost = () => {
  const navigate = useNavigate();

  const { register, getValues, handleSubmit } = useForm({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = useCallback(async () => {
    try {
      await api.post("/posts", getValues());
      alert("등록이 완료되었습니다.");
      navigate("/posts");
    } catch (error) {
      if (error.response.status === 400) {
        alert(error.response.data.message);
      } else console.log(error);
    }
  }, [getValues, navigate]);

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
