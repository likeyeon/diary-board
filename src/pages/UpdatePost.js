import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import chevronLeft from "../assets/chevron-left.svg";
import api from "../utils/api";
import { s3Bucket } from "../utils/s3Bucket";

const UpdatePost = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { register, setValue, handleSubmit } = useForm({
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
    console.log(selectedFile);
  };

  /* 이미지 삭제 함수 */
  const deleteFile = async () => {
    const myBucket = s3Bucket();
    const S3_BUCKET = process.env.REACT_APP_AWS_BUCKET_NAME;

    const params = {
      Bucket: S3_BUCKET,
      // Key: selectedFile.name && selectedFile,
      Key: "np99ox9ld4.jpg", //임의 테스트
    };

    try {
      await myBucket.deleteObject(params).promise();
      setSelectedFile(null);
    } catch (err) {
      console.log("ERROR in file Deleting : " + JSON.stringify(err));
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
        url = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${params.Key}`;
      }
    });
  };

  /* url key 값만 가져오기 */
  const getUrlKey = (url) => {
    const myURL = new URL(url);
    const path = myURL.pathname; // "/bz7dp1cb1ll.jpeg"

    // "/"로 시작하는 경우 제거
    const filename = path.startsWith("/") ? path.slice(1) : path;

    return filename; // "bz7dp1cb1ll.jpeg"
  };

  const getPost = async () => {
    try {
      const response = await api.get(`/posts/${id}`);
      const data = { ...response.data };
      // for (const key in data) {
      //   setValue(key, data[key]);
      // }
      setValue("title", data.title);
      setValue("content", data.content);
      // setSelectedFile(getUrlKey(data.image_url));
      setSelectedFile(
        getUrlKey(
          "https://diary-board.s3.ap-northeast-2.amazonaws.com/np99ox9ld4.jpg"
        )
      );
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
        await api.patch(`posts/${id}`, {
          title: data.title,
          content: data.content,
          // image_url: url
        });
        navigate(`/posts/${id}`);
      } catch (error) {
        console.log(error);
      }
    },
    [id, navigate]
  );

  const handleFormSubmit = (data) => {
    deleteFile();
    // 이미지를 업로드할 경우
    if (selectedFile) {
      uploadFile(selectedFile);
    }
    onSubmit(data);
  };

  return (
    <div className="postForm-wrapper">
      <div className="previous">
        <img className="previous-icon" src={chevronLeft} alt="chevron-left" />
        <Link to={`/posts/${id}`} className="previous-text">
          돌아가기
        </Link>
      </div>
      <div className="postForm-wrapper">
        <form
          method="post"
          className="postForm"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <input type="text" {...register("title", { required: true })} />
          <textarea {...register("content", { required: true })} />
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
                <span>{selectedFile.name || selectedFile}</span>
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
          <button type="submit" className="submitButton">
            작성완료
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePost;
