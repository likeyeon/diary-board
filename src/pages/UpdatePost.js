import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import chevronLeft from "../assets/chevron-left.svg";
import axios from "axios";

const UpdatePost = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { register, setValue, getValues, handleSubmit } = useForm({
    defaultValues: {
      id: 0,
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

  const getPost = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/posts/${id}`);
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

  const onSubmit = useCallback(async () => {
    try {
      setValue("updated_at", getCurrentTime());
      const response = await axios.patch(
        `http://localhost:8080/posts/${id}`,
        getValues()
      );
      console.log(response);
      navigate(`/posts/${id}`);
    } catch (error) {
      console.log(error);
    }
  }, [getValues, id, getCurrentTime, navigate, setValue]);

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
