
# 模板数据

### 以表格为例

添加表格列，补充类属性值

![alt text](/template-file/table.png)

预览导出数据：

![alt text](/template-file/export-data.png)


模板文件中可直接引用导入的数据：

```jsx
import React from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';

interface DataType {
}
const columns: TableProps<DataType>['columns'] = [
  <%_ tableColList.forEach(function(tableCol,colIndex){ _%>    
  { 
    <%_ tableCol.attrList.forEach(function(attr,attrIndex){ -%>
    <%- attr.attrKey %>: <%- attr.attrValue %>,
    <%_ }) -%>
  },
  <%_ }) -%>
];
const data: DataType[] = [];
const <%- componentName %>: React.FC = () => <Table columns={columns} dataSource={data} />;
export default <%- componentName %>;
```

生成文件：
```jsx
import React from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';

interface DataType {
}
const columns: TableProps<DataType>['columns'] = [
  { 
    prop: "name",
    label: "姓名",
  },
];
const data: DataType[] = [];
const Demo: React.FC = () => <Table columns={columns} dataSource={data} />;
export default Demo;
```