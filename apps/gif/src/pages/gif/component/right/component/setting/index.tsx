import { Divider, Row, Col, Button, Image } from 'antd';
import { useEffect, useMemo } from 'react';
import { useGlobalStore, useActiveObjects } from '../../../../context';
import { createForm, onFormValuesChange } from '@formily/core';
import { FormProvider } from '@formily/react';
import { fonts } from '../../../edit/component/my-fabric/fonts/downloads';
import { isText } from '../../../edit/component/my-fabric/fonts';
import { SchemaField } from './from';
import * as FabricFill  from './fabric-fill';
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
      text: {
        type: 'string',
        title: '文字内容',
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
        'x-component-props': {},
      },
      fill: {
        type: 'string',
        title: '文字颜色',
        'x-decorator': 'FormItem',
        'x-component': 'GradientColorSetter',
      },
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
                return option.data.img ? (
                  <Image
                    preview={false}
                    width={'100%'}
                    height={40}
                    style={{ objectFit: 'contain' }}
                    src={option.data.img}
                  />
                ) : (
                  option.data.label
                );
              },
            },
            enum: [
              {
                label: '默认',
                value: 'arial',
              },
              ...fonts.map((v) => {
                return {
                  img: v.img,
                  label: v.name,
                  value: v.name,
                };
              }),
            ],
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
  rect: {
    type: 'void',
    'x-component': 'DividerLayout',
    'x-component-props': {
      title: '矩形设置',
    },
    properties: {
      fill: {
        type: 'string',
        title: '颜色',
        'x-decorator': 'FormItem',
        'x-component': 'GradientColorSetter',
      },
      rx_ry: {
        type: 'string',
        title: '圆角',
        'x-decorator': 'FormItem',
        'x-component': 'NumberPicker',
      },
    },
  },
};

const isUndefined = (value: any): boolean => {
  return typeof value === 'undefined';
};




export const Setting = () => {
  const { canvas } = useGlobalStore();
  const activeObject = useActiveObjects()[0];
  console.log('activeObject: ', activeObject);
  const form = useMemo(() => {
    return createForm({
      values: {},
      effects() {
        onFormValuesChange(async (form) => {
          const { angle, rx_ry, fill,...other } = form.values;
          await canvas?.loadFont(other);
          if (!isUndefined(other.src)) {
            // fix: 图片必须走setSrc才会更新
            await activeObject.setSrc(other.src);
          }
          // fix：width,height必须在setSrc下面
          activeObject?.set({
            ...other,
            ...{
              rx: rx_ry,
              ry: rx_ry,
              fill:FabricFill.cssFillToFabricFill(fill,other),
              fill_data:fill,
            },
          });
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
          width: activeObject.get('width'),
          height: activeObject.get('height'),
          scaleX: activeObject.get('scaleX'),
          scaleY: activeObject.get('scaleY'),
          left: activeObject.get('left'),
          top: activeObject.get('top'),
          angle: activeObject.get('angle'),
          opacity: activeObject.get('opacity'),
          // images
          src: activeObject.get('src'),
          // text
          text: activeObject.get('text'),
          fill: FabricFill.fabricFillToCssFill(activeObject.get('fill'),activeObject.get('fill_data')),
          fontFamily: activeObject.get('fontFamily'),
          fontSize: activeObject.get('fontSize'),
          textAlign: activeObject.get('textAlign'),
          fontWeight: activeObject.get('fontWeight'),
          fontStyle: activeObject.get('fontStyle'),
          linethrough: activeObject.get('linethrough'),
          underline: activeObject.get('underline'),
          lineHeight: activeObject.get('lineHeight'),
          charSpacing: activeObject.get('charSpacing'),
          // - text边框
          stroke: activeObject.get('stroke'),
          strokeWidth: activeObject.get('strokeWidth'),
          strokeLineJoin: activeObject.get('strokeLineJoin'),
          strokeLineCap: activeObject.get('strokeLineCap'),
          // rect
          rx_ry: activeObject.get('rx'),
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
                  title: '基本信息',
                },
                properties: {
                  layoutWH: {
                    type: 'void',
                    'x-component': 'Space',
                    properties: {
                      width: {
                        type: 'number',
                        title: 'width',
                        'x-decorator': 'FormItem',
                        'x-component': 'NumberPicker',
                        'x-component-props': {
                          min: 0,
                        },
                      },
                      height: {
                        type: 'number',
                        title: 'height',
                        'x-decorator': 'FormItem',
                        'x-component': 'NumberPicker',
                        'x-component-props': {
                          min: 0,
                        },
                      },
                    },
                  },
                  layoutScale: {
                    type: 'void',
                    'x-component': 'Space',
                    properties: {
                      scaleX: {
                        type: 'number',
                        title: 'scaleX',
                        'x-decorator': 'FormItem',
                        'x-component': 'NumberPicker',
                        'x-component-props': {
                          min: 0,
                        },
                      },
                      scaleY: {
                        type: 'number',
                        title: 'scaleY',
                        'x-decorator': 'FormItem',
                        'x-component': 'NumberPicker',
                        'x-component-props': {
                          min: 0,
                        },
                      },
                    },
                  },
                  layout: {
                    type: 'void',
                    'x-component': 'Space',
                    properties: {
                      left: {
                        type: 'number',
                        title: 'left',
                        'x-decorator': 'FormItem',
                        'x-component': 'NumberPicker',
                      },
                      top: {
                        type: 'number',
                        title: 'top',
                        'x-decorator': 'FormItem',
                        'x-component': 'NumberPicker',
                      },
                    },
                  },
                  angle: {
                    type: 'number',
                    title: 'angle',
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
              border: {
                type: 'void',
                'x-component': 'DividerLayout',
                'x-component-props': {
                  title: '边框',
                },
                properties: {
                  layoutBorder: {
                    type: 'void',
                    'x-component': 'Space',
                    properties: {
                      stroke: {
                        type: 'string',
                        title: '颜色',
                        'x-decorator': 'FormItem',
                        'x-component': 'ColorSetter',
                        default: '',
                      },
                      strokeWidth: {
                        type: 'string',
                        title: '宽度',
                        'x-decorator': 'FormItem',
                        'x-component': 'NumberPicker',
                      },
                    },
                  },
                },
              },
            },
          }}
        />
      </FormProvider>
    </div>
  );
};
