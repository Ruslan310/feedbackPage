import React from 'react';
import {Form, message, Upload} from "antd";
import axios from "axios";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {resizeImage} from "../../util/handle";

interface Props {
  load: boolean
  setLoad: (value: boolean) => void
  picture: string
  setPicture: (value: string) => void
  className?: string
  name?: string
  label?: string
  link?: string
}

const UploadPictureReview = ({
                         load,
                         setLoad,
                         picture,
                         setPicture,
                         className,
                         name = "picture",
                         label = "Attach an image",
}: Props) => {
  const uploadButton = (
    <div>
      {load ? <LoadingOutlined/> : <PlusOutlined/>}
    </div>
  );

  return (
    <Form.Item label={label} name={name}>
      <Upload
        name={name}
        accept="image/*"
        listType="picture-card"
        className={className}
        showUploadList={false}
        customRequest={async ({file}) => {
          setLoad(true)
          try {
            const link = process.env.REACT_APP_API_URL;
            const resizedFile = await resizeImage(file as File);
            const {data} = await axios.post(`${link}/reviewImages`);
            const {url} = await fetch(data, {
              method: "PUT",
              headers: {
                "Content-Type": "multipart/form-data"
              },
              body: resizedFile
            })
            const imageUrl = url.split('?')[0]
            setPicture(imageUrl);
          } catch (error) {
            console.log('Error uploading file: ', error);
          } finally {
            setLoad(false);
          }
        }}
        beforeUpload={async (file) => {
          const isJpgOrPng =
            file.type === "image/heic" ||
            file.type === "image/heif" ||
            file.type === 'image/jpeg' ||
            file.type === 'image/png' ||
            file.type === 'image/webp';

          if (!isJpgOrPng) {
            await message.error('You can only upload JPG/PNG/WEBP file!');
          }
          const fileSize = 5;
          const isLt2M = file.size / 1024 / 1024 < fileSize;
          if (!isLt2M) {
            await message.error(`Image must smaller than ${fileSize}MB!`);
          }
          return isJpgOrPng && isLt2M;
        }}
      >
        {!load && picture ?
          <img
            src={picture}
            alt="component photo"
            style={{
              width: '100%',
              borderRadius: 8,
              height: '100%',
              maxWidth: 100,
              maxHeight: 100,
              objectFit: 'cover',
            }}
          /> : uploadButton}
      </Upload>
    </Form.Item>
  );
};

export default UploadPictureReview;
