import axios from "axios";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import api from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import chevronLeft from "../assets/chevron-left.svg";
import "../styles/post-form.scss";
import AWS from "aws-sdk";

const CreatePost = () => {
  const navigate = useNavigate();

  const { register, getValues, handleSubmit } = useForm({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const [myBucket, setMyBucket] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const ACCESS_KEY = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
  const SECRET_ACCESS_KEY = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
  const REGION = process.env.REACT_APP_AWS_REGION;
  const S3_BUCKET = process.env.REACT_APP_AWS_BUCKET_NAME;

  useEffect(() => {
    // AWS 액세스 키 설정
    AWS.config.update({
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_ACCESS_KEY,
    });

    // AWS S3 객체 생성
    const myBucket = new AWS.S3({
      params: { Bucket: S3_BUCKET },
      region: REGION,
    });

    setMyBucket(myBucket);
  }, [ACCESS_KEY, SECRET_ACCESS_KEY, S3_BUCKET, REGION]);

  // 내 컴퓨터에서 파일 장착
  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // 앞에서 장착한 파일을 S3으로 전송
  const uploadFile = (file) => {
    const params = {
      ACL: "public-read",
      Body: file,
      Bucket: S3_BUCKET,
      Key: file.name,
    };

    myBucket.putObject(params).send((error) => {
      if (error) {
        console.log(error);
      } else {
        const url = myBucket.getSignedUrl("getObject", { Key: params.Key });
      }
    });
  };

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

  const handleFormSubmit = (data) => {
    if (selectedFile) {
      uploadFile(selectedFile);
    }

    onSubmit(data);
  };

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
          onSubmit={handleSubmit(handleFormSubmit)}
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
                onChange={handleFileInput}
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
