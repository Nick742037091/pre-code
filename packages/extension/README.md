# Pre Code 

## 介绍
* 用于生成基础页面代码，方便快速开发
* 通过可视化配置动态生成参数，嵌入[ejs](https://ejs.co/)模板中实现代码生成
* 支持表单/表格场景

## 功能入口
1. 编辑器右上角的 <img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/89e68a7b98bb49a7b130294a59038127~tplv-k3u1fbpfcp-image.image" width="20" height="20" alt="图片名称" align=center /> 按钮

![Alt text](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df4c1a2b18dc4d5c8da730c482454f7b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1104&h=371&s=21796&e=png&b=202020)

2. 编辑器右键菜单的 `Pre Code` 选项
  
![alt text](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8ee83cd661b042969d8b24c8b1c59f43~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1152&h=1034&s=171792&e=png&b=1e1e1e)


## 操作指引
   
1. 添加配置项，可选类型为表格/表单
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6dd96eee19c046d2811ecaf49b7594a7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2170&h=762&s=94405&e=png&b=868686)   
1. 点击任意一个配置项，进入配置页面
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e3384c110a14b128eaf7a92e85e8924~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2198&h=886&s=68975&e=png&b=f6f6f6)
3. 表格/表单配置页面有不同的配置内容
![表格](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7802f9237d34281967eb093fa5caa44~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2194&h=1118&s=110939&e=png&b=fefefe)
![表单](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a3322d58baa406681d7306001e5f439~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2424&h=1398&s=122218&e=png&b=ffffff)
4. 添加模板文件并选中
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b657c4290a547869b76632dbd365cd5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2430&h=892&s=123934&e=png&b=fefefe)
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/320f59909b78477db58c84c4aea8b241~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2302&h=920&s=142961&e=png&b=8b8b8b)
如何编写模板文件见后文，模板名称自定义即可。
5. 输入生成文件名称，选择后缀名，后缀名支持 vue、jsx 和 tsx，即vue和react组件
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4ab2130e26e4c368de29221dcc86de8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2432&h=878&s=121579&e=png&b=fefefe)   
6. 添加全局属性和表格或表单属性
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2f80155803e421587ed31156aab3cc5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2422&h=906&s=119345&e=png&b=fefefe)
7. 预览导出到模板中的数据，根据导出的数据调整模板文件
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2655b614c0e743a9a45d572277eaf800~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2766&h=1384&s=235170&e=png&b=fefefe)
8. 点击 `生成代码` 按钮，选择生成文件所在目录，即可生成代码


