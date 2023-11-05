import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import chevronLeft from "../assets/chevron-left.svg";
import { s3Bucket } from "../utils/s3Bucket";
import "../styles/post-form.scss";
import axios from "axios";
import { useSelector } from "react-redux";

const UpdatePost = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const accessToken = useSelector((state) => state.Auth.accessToken);

  const { register, setValue, handleSubmit } = useForm({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const [selectedFile, setSelectedFile] = useState(""); // 이미지 파일 객체
  const [fileName, setFileName] = useState(""); // 이미지 이름
  const [dataFileName, setDataFileName] = useState(""); // 초기 데이터에서 받은 이미지 이름
  const [firstFileName, setFirstFileName] = useState(""); // 초기 데이터에서 받은 이미지 이름 (불변)
  const [loading, setLoading] = useState(true);

  // 내 컴퓨터에서 파일 장착
  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
    const randomFileName = getRandomFilename(e.target.files[0].name);
    setFileName(randomFileName);
  };

  /* S3 업로드한 이미지 삭제 */
  const deleteFile = async () => {
    const myBucket = s3Bucket();
    const S3_BUCKET = process.env.REACT_APP_AWS_BUCKET_NAME;

    const params = {
      Bucket: S3_BUCKET,
      Key: firstFileName,
    };

    try {
      await myBucket.deleteObject(params).promise();
    } catch (err) {
      console.log(err);
    }
  };

  // 파일 이름 임의의 랜덤 변수로 전환
  const getRandomFilename = (fileName) => {
    const originalNameParts = fileName.split(".");
    const extension = originalNameParts.pop();
    const randomString = Math.random().toString(36).substring(2);
    return `${randomString}.${extension}`;
  };

  /* 파일 업로드 */
  const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
      const myBucket = s3Bucket();
      const S3_BUCKET = process.env.REACT_APP_AWS_BUCKET_NAME;
      const REGION = process.env.REACT_APP_AWS_REGION;

      const params = {
        ACL: "public-read",
        Body: file,
        Bucket: S3_BUCKET,
        Key: firstFileName || fileName,
      };

      myBucket.putObject(params).send((error) => {
        if (error) {
          console.log(error);
        } else {
          const urlValue = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${fileName}`;
          resolve(urlValue);
        }
      });
    });
  };

  const getPost = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_DB_HOST + `/posts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = { ...response.data };
      setValue("title", data.title);
      setValue("content", data.content);
      setDataFileName(data.image);
      setFirstFileName(data.image);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPost();
  }, []);

  const onSubmit = useCallback(
    async (data) => {
      try {
        await axios.patch(
          process.env.REACT_APP_DB_HOST + `/posts/${id}`,
          {
            title: data.title,
            content: data.content,
            image: dataFileName || fileName,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        navigate(`/board/${id}`);
      } catch (error) {
        console.log(error);
      }
    },
    [id, navigate, fileName, accessToken, dataFileName]
  );

  const handleFormSubmit = async (data) => {
    // 새로운 이미지를 업로드하는 경우
    if (selectedFile) {
      try {
        if (dataFileName) {
          await deleteFile();
        }
        await uploadFile(selectedFile);
      } catch (error) {
        console.error("Error uploading file:", error);
        return;
      }
    }
    // 이미지가 비어있는 경우
    else if (!selectedFile && !dataFileName) {
      try {
        console.log("비어있음");
        await deleteFile();
      } catch (error) {
        console.error("Error uploading file:", error);
        return;
      }
    }
    onSubmit(data);
  };

  if (loading) return <div>loading...</div>;
  else
    return (
      <div className="postForm-wrapper">
        <div className="postForm-previous">
          <img
            className="postForm-previous-icon"
            src={chevronLeft}
            alt="chevron-left"
          />
          <Link to={`/board/${id}`} className="previous-text">
            돌아가기
          </Link>
        </div>
        <div className="postForm-wrapper">
          <form
            method="post"
            className="postForm"
            onSubmit={handleSubmit(handleFormSubmit)}
          >
            <input
              type="text"
              className="postForm-form__title"
              {...register("title", { required: true })}
            />
            <textarea
              className="postForm-form__textarea"
              {...register("content", { required: true })}
            />
            <div className="postForm-form__imageFile">
              {dataFileName || fileName ? (
                <>
                  <button
                    onClick={() => {
                      if (dataFileName) {
                        setDataFileName("");
                      } else if (fileName) {
                        setSelectedFile("");
                        setFileName("");
                      }
                    }}
                  >
                    파일 삭제
                  </button>
                  <span>{dataFileName ? dataFileName : fileName}</span>
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
            <button type="submit" className="postForm-form__btn">
              작성완료
            </button>
          </form>
        </div>
      </div>
    );
};

export default UpdatePost;
