# yunzai-copyfiles-js
适用于Yunzai-Bot的文件替换插件，nodejs版本需大于16.7.0

## **用途**

使改动过的js/html/css等在强制更新后恢复
距离: 修改Miao-Yunzai\plugins\miao-plugin\resources\character\profile-detail.html后，如果插件更新会导致该改动被覆盖
通过使用命令
#增加操作name,respath,Miao-Yunzai\plugins\miao-plugin\resources\character\profile-detail.html
#文件替换
可自动替换改动的文件，无需手动替换

## **安装**
```
```
## **命令**

#替换列表 显示所有配置

#文件替换 执行所有配置

#增加操作name,respath,moveto 添加一个名称为name的配置，使respath复制到moveto

#删除操作name 删除一个名称为name的配置

第一次使用#增加操作 可能会提示读取文件失败，再试一次即可
