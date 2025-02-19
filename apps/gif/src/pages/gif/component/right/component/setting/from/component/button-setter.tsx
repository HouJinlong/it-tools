import { Button } from 'antd';
import { Field } from '@formily/core';
import { observer, useField } from '@formily/react';
const baseValueMap = {
  true: true,
  false: false,
};
export const ButtonSetter = observer(() => {
  const {
    value,
    setValue,
    componentProps: { valueMap, ...ButtonProps },
  } = useField<Field>();
  const temp = valueMap || baseValueMap;
  const isTrue = value === temp['true'];
  return (
    <Button
      {...ButtonProps}
      type={isTrue ? 'primary' : 'default'}
      onClick={() => {
        setValue(temp[!isTrue]);
      }}
    />
  );
});
