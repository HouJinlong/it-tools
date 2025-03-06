import { Tag, Tree, TreeProps } from 'antd';
import { useGlobalStore } from '../../../context';
import * as fabric from 'fabric';
import { useCallback, useEffect, useState } from 'react';
import {  debounce} from "lodash-es";
export const Layer = () => {
  const { canvas: ctx, activeObjectIds } = useGlobalStore();
  const [list, setList] = useState<{
    id: string;
    type: string;
    text: string;
    isLock: boolean;
  }>([]);

  useEffect(() => {
    const traverseObjects = (objects,isGroup) => {
      const allObjects = [];
      objects.reverse().forEach((obj, i) => {
        allObjects.push({
          key: obj.id,
          title: (
            <>
              <Tag
                color="#108ee9"
                style={{
                  fontSize: '10px',
                  lineHeight: 1,
                  padding: '2px',
                  marginRight: '2px',
                }}
                size="small"
              >
                {obj.type}
              </Tag>
              {obj.text ||
                obj.name ||
                {
                  group: '图组',
                  'image':'图片',
                }[obj.type]}{' '}
            </>
          ),
          type: obj.type,
          name: obj.name,
          text: obj.text,
          isLock: !obj.selectable,
          checkable:!isGroup,
          children:
            obj instanceof fabric.Group
              ? traverseObjects(obj.getObjects(),true)
              : [],
        });
      });
      return allObjects;
    };
    const fn = () => {
      setList(traverseObjects(ctx.getObjects()));
    };
    fn();
    ctx.on("after:render",  debounce(fn, 100));
  }, [ctx]);

  const onDrop: TreeProps['onDrop'] = useCallback((info) => {
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');

    const dropPosition =  (list.length-1) - Number(dropPos[dropPos.length - 1]);

    const temp = ctx.getObjects().filter((v) => v.id === dragKey);
    ctx.moveObjectTo(temp[0], dropPosition);
  },[list.length,ctx]);
  const onSelect =useCallback<TreeProps["onSelect"]>((keys,info) => {
    let selectedKeys = keys
    if(info.event==='select'){
      selectedKeys = [info.node.key]
    }
    if (selectedKeys.length === 0) {
      ctx.discardActiveObject();
    } else {
      const temp = ctx.MyGetObjects(...selectedKeys);
      if (temp.length === 1) {
        ctx.setActiveObject(temp[0]);
      } else {
        ctx.setActiveObject(
          new fabric.ActiveSelection(temp, {
            canvas: ctx,
          })
        );
      }
    }
    ctx.renderAll();
  },[ctx]);
  return (
    <Tree
      blockNode
      draggable={{
        icon: false
      }}
      treeData={list}
      checkable
      showLine
      multiple
      onDrop={onDrop}
      selectedKeys={activeObjectIds}
      checkedKeys={activeObjectIds}
      onSelect={onSelect}
      onCheck={onSelect}
    />
  );
};
