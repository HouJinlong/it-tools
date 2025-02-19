import { Divider, Row, Col, Button, Image } from 'antd';
import { useEffect, useMemo } from 'react';
import { useGlobalStore } from '../../../../context';
import { createForm, onFormValuesChange } from '@formily/core';
import { FormProvider } from '@formily/react';
import { fonts } from '../../../edit/component/my-fabric/fonts/downloads';
import { isText } from '../../../edit/component/my-fabric/fonts';
import { SchemaField } from './from';
import {
  BoldOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  UnderlineOutlined,
} from '@ant-design/icons';
import './index.css';
const schemaMap = {
  image: {
    type: 'void',
    'x-component': 'DividerLayout',
    'x-component-props': {
      title: '图片设置',
    },
    properties: {
      src: {
        type: 'string',
        title: '图片',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'ImageSetter',
      },
    },
  },
  text: {
    type: 'void',
    'x-component': 'DividerLayout',
    'x-component-props': {
      title: '文字设置',
    },
    properties: {
      layout: {
        type: 'void',
        'x-component': 'Space',
        'x-component-props': {
          className: 'my-ant-space first',
        },
        properties: {
          fontFamily: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              style: {
                width: '100%',
              },
              placeholder: '字体',
              optionRender: (option) => {
                return (
                  <Image
                    preview={false}
                    width={'100%'}
                    height={40}
                    style={{ objectFit: 'contain' }}
                    src={option.data.img}
                  />
                );
              },
            },
            enum: fonts.map((v) => {
              return {
                img: v.img,
                label: v.name,
                value: v.name,
              };
            }),
          },
          fontSize: {
            type: 'number',
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker',
            'x-component-props': {
              style: {
                width: '60px',
              },
              min: 0,
            },
          },
        },
      },
      textAlign: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Radio.Group',
        'x-component-props': {
          optionType: 'button',
          buttonStyle: 'solid',
          size: 'middle',
        },
        enum: ['left', 'center', 'right', 'justify'].map((v) => {
          return {
            label: v,
            value: v,
          };
        }),
      },
      layout1: {
        type: 'void',
        'x-component': 'SpaceCompact',
        'x-component-props': {
          block: true,
        },
        properties: {
          fontWeight: {
            type: 'boolean',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              style: {
                flex: 1,
              },
            },
            'x-component': 'ButtonSetter',
            'x-component-props': {
              block: true,
              icon: <BoldOutlined />,
              valueMap: {
                true: 'bold',
                false: 'normal',
              },
            },
          },
          fontStyle: {
            type: 'boolean',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              style: {
                flex: 1,
              },
            },
            'x-component': 'ButtonSetter',
            'x-component-props': {
              block: true,
              icon: <ItalicOutlined />,
              valueMap: {
                true: 'italic',
                false: 'normal',
              },
            },
          },
          linethrough: {
            type: 'boolean',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              style: {
                flex: 1,
              },
            },
            'x-component': 'ButtonSetter',
            'x-component-props': {
              block: true,
              icon: <StrikethroughOutlined />,
            },
          },
          underline: {
            type: 'boolean',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              style: {
                flex: 1,
              },
            },
            'x-component': 'ButtonSetter',
            'x-component-props': {
              block: true,
              icon: <UnderlineOutlined />,
            },
          },
        },
      },
      layout2: {
        type: 'void',
        'x-component': 'Space',
        properties: {
          lineHeight: {
            type: 'number',
            title: '行高',
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker',
            'x-component-props': {
              min: 0,
            },
          },
          charSpacing: {
            type: 'number',
            title: '间距',
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker',
            'x-component-props': {
              min: 0,
            },
          },
        },
      },
    },
  },
};

const isUndefined = (value: any): boolean => {
  return typeof value === 'undefined';
};
export const Setting = () => {
  const { activeObjects, canvas } = useGlobalStore();
  const activeObject = activeObjects[0];
  const form = useMemo(() => {
    return createForm({
      values: {},
      effects() {
        onFormValuesChange(async (form) => {
          const {angle, ...other } = form.values;
          await canvas?.loadFont(other);
          activeObject?.set(other);
          if (!isUndefined(other.src)) {
            // fix: 图片必须走setSrc才会更新
            await activeObject.setSrc(other.src);
          }
          if (!isUndefined(angle)) {
            // fix: rotate 也会设置left/top
            activeObject.rotate(angle);
          }
          activeObject.setCoords();
          canvas?.requestRenderAll();
        });
      },
    });
  }, [activeObject.id]);
  useEffect(() => {
    const temp = () => {
      form.setValues(
        {
          left: activeObject.get('left'),
          top: activeObject.get('top'),
          angle: activeObject.get('angle'),
          opacity: activeObject.get('opacity'),
          // 图片
          src: activeObject.get('src'),
          // 文字
          fontFamily: activeObject.get('fontFamily'),
          fontSize: activeObject.get('fontSize'),
          textAlign: activeObject.get('textAlign'),
          fontWeight: activeObject.get('fontWeight'),
          fontStyle: activeObject.get('fontStyle'),
          linethrough: activeObject.get('linethrough'),
          underline: activeObject.get('underline'),
          lineHeight: activeObject.get('lineHeight'),
          charSpacing: activeObject.get('charSpacing'),
        },
        'overwrite'
      );
    };
    temp();
    canvas?.on('object:modified', temp);
    return () => {
      canvas?.off('object:modified', temp);
    };
  }, [activeObject]);
  console.log('activeObject.type: ', activeObject.type);

  return (
    <div className="Setting">
      <FormProvider form={form} key={activeObject.id}>
        <SchemaField
          schema={{
            type: 'object',
            properties: {
              base: {
                type: 'void',
                'x-component': 'DividerLayout',
                'x-component-props': {
                  title: '位置信息',
                },
                properties: {
                  layout: {
                    type: 'void',
                    'x-component': 'Space',
                    properties: {
                      left: {
                        type: 'number',
                        title: 'left',
                        required: true,
                        'x-decorator': 'FormItem',
                        'x-component': 'NumberPicker',
                      },
                      top: {
                        type: 'number',
                        title: 'top',
                        required: true,
                        'x-decorator': 'FormItem',
                        'x-component': 'NumberPicker',
                      },
                    },
                  },
                  angle: {
                    type: 'number',
                    title: 'angle',
                    required: true,
                    'x-component-props': {
                      max: 360,
                      min: 0,
                    },
                    'x-decorator': 'FormItem',
                    'x-component': 'NumberPicker',
                  },
                  opacity: {
                    type: 'number',
                    title: 'opacity',
                    required: true,
                    'x-decorator': 'FormItem',
                    'x-component-props': {
                      step: 0.01,
                      max: 1,
                      min: 0,
                    },
                    'x-component': 'NumberPicker',
                  },
                },
              },
              other: isText(activeObject.type)
                ? schemaMap.text
                : schemaMap[activeObject.type] || {},
            },
          }}
        />
      </FormProvider>
    </div>
  );
};
