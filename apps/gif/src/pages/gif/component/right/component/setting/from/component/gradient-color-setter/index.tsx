import { observer, useField } from '@formily/react';
import { Field } from '@formily/core';
import { Input, Popover } from 'antd';
import { useSize } from 'ahooks';
import ColorPicker, {
  ColorPickerProps,
} from 'react-best-gradient-color-picker';
import { useRef } from 'react';
import './index.css';

const ScaleColorPicker = (props: ColorPickerProps) => {
  const picker = useRef<HTMLDivElement>(null);
  // const size = useSize(picker);
  return (
    <div
      style={{
        width: `${294 * 0.8}px`,
        height: `${594.1 * 0.8}px`,
        // transition:'all .1s'
      }}
    >
      <div
        ref={picker}
        style={{
          width: '294px',
          transform: 'scale(.8)',
          transformOrigin: 'left top',
        }}
      >
        <ColorPicker {...props} />
      </div>
    </div>
  );
};

export const GradientColorSetter = observer(() => {
  const container = useRef<HTMLDivElement>(null);
  const { setValue, value: _value } = useField<Field>();
  const value = _value || '';

  return (
    <div
      className="GradientColorSetter"
      ref={container}
      style={{ overflow: 'visible' }}
    >
      <Input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        prefix={
          <Popover
            placement="left"
            content={
              <ScaleColorPicker
                value={value}
                onChange={(str) => {
                  setValue(str);
                }}
              />
            }
          >
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '2px',
                border: '1px solid #d9d9d9',
                cursor: 'pointer',
                background: value,
              }}
            ></div>
          </Popover>
        }
      />
    </div>
  );
});
