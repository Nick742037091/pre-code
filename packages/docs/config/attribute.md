# 属性

模板中可嵌入自定义变量，自定义变量通过配置属性生成，属性需要先添加后再配置值

![alt text](/attribute/add-attribute.png)


![alt text](/attribute/attribute-value.png){ width="500px" }

属性包括键值、标题和类型

键值：属性的唯一标识

标题：用于区分属性，不会出现在导出数据中

类型：控制属性的配置方式，包括输入框、计数器、开关、选择器和代码
* 输入框：作为字符串输出，带双引号
* 计数器：作为数字输出
* 开关：作为布尔值输出，即`true`/`false`
* 选择器：可配置字符串选项，选择项作为字符串输出，带双引号
* 代码：输出内容即输入内容

![alt text](/attribute/eidt-attribute.png)


## 全局属性
每个配置可单独添加全局属性，全局属性的值在导出数据中可直接访问

![alt text](/attribute/global-attribute-1.png)


![alt text](/attribute/global-attribute-2.png)


![alt text](/attribute/global-attribute-3.png)