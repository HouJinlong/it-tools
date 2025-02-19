import { createSchemaField } from '@formily/react';
import { Space as AntdSpace  } from 'antd';

import {
  FormItem,
  Input,
  NumberPicker,
  DatePicker,
  TimePicker,
  Select,
  Radio,
  Switch,
  Space,
  ArrayItems,
  ArrayTable,
  FormCollapse,
  FormGrid,
  FormLayout,
  FormTab,
  PreviewText,
  Editable,
  SelectTable,
  Checkbox,
} from '@formily/antd-v5';
import * as Component from './component';

export const SchemaField = createSchemaField({
  components: {
    ...Component,
    'SpaceCompact':AntdSpace.Compact,
    FormItem,
    Input,
    NumberPicker,
    DatePicker,
    TimePicker,
    Select,
    Radio,
    Switch,
    Space,
    ArrayItems,
    ArrayTable,
    FormCollapse,
    FormGrid,
    FormLayout,
    FormTab,
    PreviewText,
    Editable,
    SelectTable,
    Checkbox,
  },
  scope: {},
});
