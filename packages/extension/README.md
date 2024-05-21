# Pre Code 

## 介绍
* 用于生成基础页面代码，方便快速开发
* 通过可视化配置动态生成参数，嵌入[ejs](https://ejs.co/)模板中实现代码生成
* 支持表单/表格场景

## 功能入口
### 1.编辑器右上角的 <img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/89e68a7b98bb49a7b130294a59038127~tplv-k3u1fbpfcp-image.image" width="20" height="20" alt="图片名称" align=center /> 按钮
<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df4c1a2b18dc4d5c8da730c482454f7b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image" width="900" alt="图片名称" />

### 2.编辑器右键菜单的 `Pre Code` 选项  
<img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8ee83cd661b042969d8b24c8b1c59f43~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#" width="500" alt="图片名称" />

## 操作指引
   
### 1.添加配置项，可选类型为表格/表单
<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6dd96eee19c046d2811ecaf49b7594a7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image" width="900" alt="图片名称" />

### 2.点击任意一个配置项，进入配置页面
<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e3384c110a14b128eaf7a92e85e8924~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image" width="900" alt="图片名称" />

### 3. 表格/表单配置页面有不同的配置内容
<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7802f9237d34281967eb093fa5caa44~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image" width="900" alt="图片名称" />

<img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a3322d58baa406681d7306001e5f439~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image" width="900" alt="图片名称" style="margin-top: 5px"/>

### 4. 添加模板文件并选中
<img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b657c4290a547869b76632dbd365cd5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image" width="900" alt="图片名称" />

<img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/320f59909b78477db58c84c4aea8b241~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image" width="900" alt="图片名称" style="margin-top: 5px"/>

如何编写模板文件见[后文](#templateFile)，模板名称自定义即可
### 5. 输入生成文件名称，选择后缀名，后缀名支持 vue、jsx 和 tsx，即vue和react组件

<img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4ab2130e26e4c368de29221dcc86de8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image" width="900" alt="图片名称" />

### 6. 添加全局属性和表格或表单属性
<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2f80155803e421587ed31156aab3cc5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image" width="900" alt="图片名称" />

如何添加属性见[后文](#attribute)

### 7. 预览导出到模板中的数据，根据导出的数据调整模板文件
<img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2655b614c0e743a9a45d572277eaf800~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image" width="900" alt="图片名称" />

### 8. 点击 `生成代码` 按钮，选择生成文件所在目录，即可生成代码

<span id="templateFile"></span>
## 编写模板文件
插件使用[ejs](https://ejs.co/)作为模板引擎，它使用嵌入式JavaScript代码来动态生成HTML，模板标记为`<% %>`，详细使用方式如下：
### `<% %>` 
`脚本标记`，可内嵌js脚本，用于流程控制，多个标记可以组合起来作为一段完整脚本。比如
#### if语句
```html
<% if (condition) { %>
  <p>condition为true</p>
<% } else { %>
  <p>condition为false</p>
<% } %>
```
#### for循环
```html
<% for (let i = 0; i < 10; i++) { %>
  <p>第<%= i %>次循环</p>
<% } %>
```

### `<%= %>`
`转义变量输出标记`，可内嵌js变量，变量会转义后输出

### `<%- %>`
`变量输出标记`，可内嵌js变量，变量会直接输出

### `<%# %>`
`注释标记`，可内嵌注释，不执行，不输出

<br/>

----

<br/>

有时候，为了提高可读性，上述的`脚步标记`、`输出标记`、`注释标记`会换行书写，由于模板引擎对于换行符是直接输出的，所以在输出时会显示为一行空白。所以需要以下辅助标记：


### `<%_`
`前置空白删除标记`，用于删除`模板标记`前面的空格符。与`输出标记`和`注释标记`存在冲突，因此只能在`脚步标记`中使用

### `_%>`
`后置空白删除标记`，用于删除`模板标记`后面的空格符

### `-%>`
`后置换行删除标记`，用于删除`模板标记`后面的换行符

### 模板文件嵌入动态数据
模板文件中可直接引用导入的数据，如下：
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
导出数据：

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa779ad88dea41d3ad593f075cfccd36~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image" width="900" alt="图片名称" />

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

<span id="attribute"></span>
## 属性

模板中可嵌入自定义变量，自定义变量通过配置属性生成，属性需要先添加后再配置值


<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce6769d7441f4812b01b6d256d98c4f8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image" width="900" alt="图片名称" />

<img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e3c8ad4922934cf0b431398769877a9b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image" width="900" alt="图片名称" style="margin-top:5px" />

<img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c42656b73ef4b39b9b3dcfcdc09b1c8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image" width="500" alt="图片名称" style="margin-top:5px" />

属性包括键值、标题和类型

键值：属性的唯一标识

标题：用于区分属性，不会出现在导出数据中

类型：控制属性的配置方式，包括输入框、计数器、开关、选择器和代码
* 输入框：作为字符串输出，带双引号
* 计数器：作为数字输出
* 开关：作为布尔值输出，即`true`/`false`
* 选择器：可配置字符串选项，选择项作为字符串输出，带双引号
* 代码：输出内容即输入内容

<img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea0b648642304bbd9a13226fbd212f14~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image" width="900" alt="图片名称" />

## 全局属性
每个配置可单独添加全局属性，全局属性的值在导出数据中可直接访问

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f92b185204b84de1a56152f82517da03~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image" width="900" alt="图片名称" />

<img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c42656b73ef4b39b9b3dcfcdc09b1c8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image" width="500" alt="图片名称" style="margin-top:5px"  />

<img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/74fe00702adf4402990d37fcf9c340cf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image" width="900" alt="图片名称" style="margin-top:5px"  />


## 表格数据

表格列的属性可以动态配置

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c3faa62408b435596742c4a05a619fa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image" width="900" alt="图片名称" />

新创建的表格配置，默认每个表格列带有prop和label两个属性，可以新增或者修改属性

<img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e2baa1af0704a80bb8d5dbbf6fba129~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image" width="900" alt="图片名称" />

点击添加列，列属性会根据类型渲染输入元素，根据需求输入或选择对应的值

<img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9a200bba3c24df382e6996d3f6bf287~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image" width="900" alt="图片名称" />


可在导出数据中看到表格数据`tableColList`，每个列中的`attrList`用于变量属性，`attrMap`用于查找属性值。

<img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c9b4d43d0a644ec9826d1e0f882c6cf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image" width="900" alt="图片名称" />