# 1.CSS选择器

## 1.引入CSS的三种方式

1. 内联式 css样式表就是把css代码直接写在现有的HTML标签中
2. 嵌入式 把css样式代码写在`<style type="text/css">XXX</style>`标签之间
3. 外部式 外部式css样式，写在单独的一个文件中

离被设置元素越近优先级别越高

## 2.选择器优先级

选择器主要包含几种：id选择器、类选择器、属性选择器、伪类选择器、元素选择器(div,h1,p)、伪元素选择器、通配符选择器、关系选择器。

其中关系选择器：

1. E F 包含选择器(后代选择器) F是E里面的元素
2. E>F 子选择器 E是F的父元素 这个限定比包含选择器更加严格，必须是下一级而不是说后代就行了
3. E+F 相邻兄弟选择器 F紧跟在E的后面
4. E~F 兄弟选择器 F跟在E的后面



**优先级**：

1. !important
2. 内联式
3. **ID**选择器
4. **类**选择器、属性选择器、伪类选择器
5. **元素**选择器、伪元素选择器
6. 通配符

判断优先级时，首先我们会判断一条属性声明是否有权重，也就是是否在声明后面加上了!important。一条声明如果加上了权重，那么它的优先级就是最高的，前提是它之后不再出现相同权重的声明。如果权重相同，我们则需要去比较匹配规则的特殊性。一条匹配规则一般由多个选择器组成，一条规则的特殊性由组成它的选择器的特殊性累加而成。选择器的特殊性可以分为四个等级，
第一个等级是行内样式，为1000

第二个等级是id选择器，为0100

第三个等级是类选择器、伪类选择器和属性选择器，为0010

第四个等级是元素选择器和伪元素选择器，为0001。

规则中每出现一个选择器，就将它的特殊性进行叠加，这个叠加只限于对应的等级的叠加，不会产生进位。选择器特殊性值的比较是从左向右排序的，也就是说以1开头的特殊性值比所有以0开头的特殊性值要大。比如说特殊性值为1000的的规则优先级就要比特殊性值为0999的规则高。如果两个规则的特殊性值相等的时候，那么就会根据它们引入的顺序，后出现的规则的优先级最高。





# 2.CSS布局

## 1.水平居中

1. 对于`行内元素`: text-align: center;

2. 对于确定宽度的块级元素

   + margin: 0 auto;

     ~~~css
     .wrapper {
       width: 80%;
       height: 500px;
     }
     .center {
       width: 500px;
       margin: 0 auto;
     }
     ~~~

   + 设置父元素postion: relative，为子元素设置宽度，偏移量设置为50%，偏移方向外边距设置为元素宽度一半乘以-1

     ~~~css
     .wrapper {
       width: 80%;
       height: 500px;
       position: relative;
     }
     .center {
       width: 500px;
       position: absolute;
       left: 50%;
       margin-left: -250px;
     }
     ~~~

3. 对于宽度未知的块级元素

   + table标签配合margin左右auto实现水平居中。使用table标签（或直接将块级元素设值为display:table），再通过给该标签添加左右margin为auto。

   + inline-block实现水平居中方法。display：inline-block和text-align:center实现水平居中。

     ~~~css
     .container {
     	text-align: center;
     }
     
     .box {
     	display: inline-block;
     	width: 500px;
     	height: 400px;
     }
     ~~~

   + 绝对定位+transform，translateX可以移动本身元素的50%

     ~~~css
     .container {
     	width: 100%;
     	height: 200px;
     	position: relative;
     }
     
     .box {
     	width: 200px;
     	height: 200px;
     	position: absolute;
     	left: 50%;
     	transform: translateX(-50%);
     }
     ~~~

   + flex布局使用justify-content:center

   

## 2.垂直居中

1. 利用`line-height`实现居中，这种方法适合纯文字类
2. 通过设置父容器`相对定位`，子级设置`绝对定位`，标签通过margin实现自适应居中
3. 弹性布局`flex`:父级设置display: flex; 子级设置margin为auto实现自适应居中
4. 父级设置相对定位，子级设置绝对定位，并且通过位移`transform`实现



## 3.垂直水平居中

1. 





# 3.浮动布局





96/29

+ dom diff
+ fiber
+ window.requestIdleCallback
+ React-router



1. pmp填写
2. cf任务另开一行
3. 