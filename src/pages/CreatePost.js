import { useForm } from "react-hook-form";
import { useCallback, useState } from "react";
import api from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import chevronLeft from "../assets/chevron-left.svg";
import "../styles/post-form.scss";
import { s3Bucket } from "../utils/s3Bucket";

const CreatePost = () => {
  const navigate = useNavigate();

  const { register, getValues, handleSubmit } = useForm({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const [selectedFile, setSelectedFile] = useState(null);
  let url = "";

  // 내 컴퓨터에서 파일 장착
  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // 파일 이름 임의의 랜덤 변수로 전환
  const getRandomFilename = (fileName) => {
    const originalNameParts = fileName.split(".");
    const extension = originalNameParts.pop();
    const randomString = Math.random().toString(36).substring(2);
    return `${randomString}.${extension}`;
  };

  // 앞에서 장착한 파일을 S3으로 전송
  const uploadFile = (file) => {
    const myBucket = s3Bucket();
    const S3_BUCKET = process.env.REACT_APP_AWS_BUCKET_NAME;
    const REGION = process.env.REACT_APP_AWS_REGION;

    const params = {
      ACL: "public-read",
      Body: file,
      Bucket: S3_BUCKET,
      Key: getRandomFilename(file.name),
    };

    myBucket.putObject(params).send((error) => {
      if (error) {
        console.log(error);
      } else {
        // url = myBucket.getSignedUrl("getObject", {
        //   Bucket: params.Bucket,
        //   Key: params.Key,
        // });
        url = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${params.Key}`;
      }
    });
  };

  const onSubmit = useCallback(async () => {
    try {
      await api.post("/posts", getValues()); // 이미지 포함 시 -> {...getValues(), image_url: url}
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
              {selectedFile ? (
                <>
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                    }}
                  >
                    파일 삭제
                  </button>
                  <span>{selectedFile.name}</span>
                </>
              ) : (
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleFileInput}
                />
              )}
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
