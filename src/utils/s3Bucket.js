import AWS from "aws-sdk";

export const s3Bucket = () => {
  const ACCESS_KEY = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
  const SECRET_ACCESS_KEY = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
  const REGION = process.env.REACT_APP_AWS_REGION;

  // AWS 액세스 키 설정
  AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
    region: REGION,
  });

  // AWS S3 객체 생성
  return new AWS.S3();
};
