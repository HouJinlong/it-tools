import { observer, useField} from '@formily/react';
import { Field } from '@formily/core';
import { Input,Popover } from "antd";
import { SketchPicker } from 'react-color';
import  { useRef } from 'react';
import './index.css';
export const ColorSetter = observer(() => {
const container = useRef<HTMLDivElement>(null);
 const {setValue,value:_value}  = useField<Field>()
 const value = _value ||""
 return (
    <div className='ColorSetter' ref={container}>
      <Input
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      prefix={
        <Popover
          autoAdjustOverflow
          getPopupContainer={() => container.current}
          content={
            <SketchPicker
              color={value}
              onChange={({ rgb }) => {
                setValue(`rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`);
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
