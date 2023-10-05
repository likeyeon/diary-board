import React, { useCallback, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import chevronLeft from "../assets/chevron-left.svg";
import axios from "axios";
import api from "../utils/api";

const UpdatePost = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { register, setValue, getValues, handleSubmit } = useForm({
    defaultValues: {
      author: "",
      title: "",
      created_at: "",
      id: 0,
      modified_at: "",
      content: "",
    },
  });

  const getPost = useCallback(async () => {
    try {
      const response = await api.get(`/posts/${id}`);
      const data = { ...response.data };
      for (const key in data) {
        setValue(key, data[key]);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getPost();
  }, []);

  const onSubmit = useCallback(
    async (data) => {
      try {
        await api.patch(`posts/${id}`, {
          title: data.title,
          content: data.content,
        });
        navigate(`/posts/${id}`);
      } catch (error) {
        console.log(error);
      }
    },
    [id, navigate]
  );

  return (
    <div className="createForm-wrapper">
      <div className="previous">
        <img className="previous-icon" src={chevronLeft} alt="chevron-left" />
        <Link to={`/posts/${id}`} className="previous-text">
          돌아가기
        </Link>
      </div>
      <div className="createForm-wrapper">
        <form
          method="post"
          className="createForm"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input type="text" {...register("title", { required: true })} />
          <textarea {...register("content", { required: true })} />
          <input type="file" id="chooseImg" name="chooseImg" accept="image/*" />
          <button type="submit" className="submitButton">
            작성완료
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePost;
