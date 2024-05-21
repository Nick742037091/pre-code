# 表格配置

表格列的属性列表可以动态配置

![alt text](/table-config/1.png)

新创建的表格配置，默认每个表格列带有prop和label两个属性，可以新增或者修改属性

![alt text](/table-config/2.png)

点击添加列，列属性会根据类型渲染输入元素，根据需求输入或选择对应的值

![alt text](/table-config/3.png)

可在导出数据中看到表格数据`tableColList`，每个列中的`attrList`用于遍历属性，`attrMap`用于查找属性值。

![alt text](/table-config/4.png)