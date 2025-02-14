import { Divider, Row, Col, Button, Image } from 'antd';
import { useMemo } from 'react';
import { useGlobalStore } from '../../../../context';
import { createForm, onFormValuesChange } from '@formily/core';
import { FormProvider } from '@formily/react';
import { SchemaField } from './from';

const schemaMap = {
  image: {
    src: {
      type: 'string',
      title: '图片',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'ImageSetter',
    },
  },
};
export const Setting = () => {
  const { activeObjects, canvas } = useGlobalStore();
  const activeObject = activeObjects[0];
  const form = useMemo(() => {
    return createForm({
      values: activeObject.toJSON(),
      effects() {
        onFormValuesChange(async (form) => {
          const { src } = form.values;
          if (src) {
            await activeObject.setSrc(src);
          }
          canvas?.renderAll();
        });
      },
    });
  }, [activeObject, canvas]);
  return (
    <div>
      <Divider orientation="left">设置</Divider>
      <FormProvider form={form} key={activeObject.id}>
        <SchemaField
          schema={{
            type: 'object',
            properties: {
              layout: {
                type: 'void',
                'x-component': 'FormLayout',
                'x-component-props': {
                  labelCol: 6,
                  wrapperCol: 10,
                  layout: 'vertical',
                },
                properties: schemaMap[activeObject.type] || {},
              },
            },
          }}
        />
      </FormProvider>
    </div>
  );
};
