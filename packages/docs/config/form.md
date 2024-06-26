# 表单配置

配置页面分为三部分：`表单组件列表`、`表单项列表`和`表单项属性/表单元素属性`

### 表格组件列表
表单组件包含名称、类型、表单项属性列表和表单元素属性列表
* 名称：用于区分组件，不会出现在导出数据中
* 类型：组件的唯一标识
* 表单项属性列表：结构同全局属性，每个组件有单独的配置，用于为表单项添加属性
* 表单元素属性列表：结构同全局属性，每个组件有单独的配置，用于为表单项内部的元素添加属性

![alt text](/form-config/1.png)

![alt text](/form-config/2.png)

### 表单项列表 
表单组件可拖拽至`表单配置`中生成`表单项`，每个表格项有独立的数据

![alt text](/form-config/3.gif)

表单项可以拖拽调整排序

![alt text](/form-config/4.gif)

### 表单项属性/表单元素属性
点击表单项，页面右侧会回显对应的表单项属性/表单元素属性，配置属性值后可在导出数据中看到表单数据`formItemList`

![alt text](/form-config/5.png)

![alt text](/form-config/6.png)