import * as fabric from 'fabric';
import { useGlobalStore } from '../../../context';

import React, { useMemo } from 'react';
import { Upload, FormItem } from '@formily/antd-v5';
import { createForm, onFormValuesChange } from '@formily/core';
import { FormProvider, createSchemaField } from '@formily/react';
import { InboxOutlined } from '@ant-design/icons';

const DraggerUpload = (props) => {
  return (
    <Upload.Dragger
      {...props}
      maxCount={1}
      showUploadList={false}
      customRequest={({ file, onSuccess, onError }) => {
        const url = URL.createObjectURL(file);
        onSuccess(url); 
      }}
      accept="image/*"
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">单击或拖动文件到此区域进行上传</p>
    </Upload.Dragger>
  );
};

const SchemaField = createSchemaField({
  components: {
    DraggerUpload,
    FormItem,
  },
});

export const UploadImg = () => {
  const canvas = useGlobalStore().canvas!;
  const form = useMemo(() => {
    return createForm({
      effects() {
        onFormValuesChange((form) => {
          console.log('form.values.img: ', form.values.img);
          if (form.values.img && form.values.img[0]) {
            fabric.Image.fromURL(form.values.img[0].response).then((img)=>{
                canvas.add(img);
                canvas.renderAll();
            });
          }
        });
      },
    });
  }, []);
  return (
    <FormProvider form={form}>
      <SchemaField>
        <SchemaField.Array
          name="img"
          x-decorator="FormItem"
          x-component="DraggerUpload"
        />
      </SchemaField>
    </FormProvider>
  );
};
