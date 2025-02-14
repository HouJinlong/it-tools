import { observer, useField } from '@formily/react';
import { Field } from '@formily/core';
import { Input, Upload, Popover, Image } from 'antd';
import { FC } from 'react';
import { UploadOutlined, FileImageOutlined } from '@ant-design/icons';

import { PropsWithChildren } from 'react';
export const AddonWarp = (props: PropsWithChildren<unknown>) => {
  return (
    <>
      <div
        style={{
          width: '1em',
        }}
      ></div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '20px',
        }}
      >
        {props.children}
      </div>
    </>
  );
};

const Base: FC<{ value; setValue }> = (props) => {
  return (
    <Input
      addonAfter={
        <Upload
          accept="image/*"
          showUploadList={false}
          customRequest={({ file, onSuccess, onError }) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              props.setValue(event.target.result);
            };
            reader.readAsDataURL(file);
            // const url = URL.createObjectURL(file);
            // onSuccess(url);
          }}
        >
          <AddonWarp>
            <UploadOutlined />
          </AddonWarp>
        </Upload>
      }
      addonBefore={
        <AddonWarp>
          {props.value ? (
            <Popover
              content={
                <Image
                  src={props.value}
                  style={{
                    maxHeight: '300px',
                    maxWidth: '300px',
                  }}
                />
              }
            >
              <Image
                src={props.value}
                preview={false}
                style={{
                  display: 'block',
                  margin: '5px',
                  maxHeight: '20px',
                  maxWidth: '20px',
                }}
              />
            </Popover>
          ) : (
            <FileImageOutlined />
          )}
        </AddonWarp>
      }
      value={props.value}
      onChange={(e) => {
        props.setValue(e.target.value);
      }}
    />
  );
};
export const ImageSetter = observer(() => {
  const { setValue, value } = useField<Field>();
  return <Base setValue={setValue} value={value}></Base>;
});
