import { Divider } from 'antd';
export const DividerLayout = (props) => {
  return (
    <>
      <Divider orientation="left">{props.title}</Divider>
      {props.children}
    </>
  );
};
