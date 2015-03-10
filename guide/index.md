## 综述

Progressbars。

![http://gtms02.alicdn.com/tps/i2/TB1DApgHXXXXXbOXXXXFvIM3VXX-434-180.png](http://gtms02.alicdn.com/tps/i2/TB1DApgHXXXXXbOXXXXFvIM3VXX-434-180.png)

## 初始化组件
    //皮肤文件建议直接拿源码的less文件根据自己业务定制化使用
    S.use('kg/progressbars/1.0.0/index', function (S, Progressbars) {
         var vc-progressbars = new Progressbars({
            $target: '#progressbar'
         });
    })
    
    //HTML结构
    <div id="progressbar" class="vc-progressbar">
        <div class="vc-progressbar-volume"></div>
    </div>

## API说明

### 属性

|名称|类型|默认值|描述|
|:---------------|:--------|:----|:----------|
|$target|String/NodeList|''|渲染容器|
|min|Number|0|最小值|
|max|Number|100|最大值|
|value|Number|0|当前值|
|tpl|String|'{value}/{max}'|提示内容，可加入html，提供*'{value}'* / *'{max}'* / *'{percent}'*匹配值，为当前值、最大值和百分比|
|type|String|'value'|类型，*'value'* / *'percent'* / *'indeterminate'* / *'loading'*|
|disabled|Boolean|false|禁用，值可以修改，但不能与用户交互，除非**disabled = false**|
|animate|Boolean|true|animate=true，执行show()或hide()方法，会显示动画效果；animate=true, 且type='value'或type='percent'时，改变当前值，会显示动画效果|

### 方法

|名称|参数|返回值|描述|
|:---------------|:--------|:----|:----------|
|show|/|/|显示组件|
|hide|/|/|隐藏组件|
|destroy|/|/|析构|
|setter|*'value'* / *'disabled'* / *'tpl'*|/|设置参数对应的属性值|
|getter|*'value'* / *'disabled'* / *'tpl'*|返回参数对应的属性值|返回参数对应的属性值|
|defineSetter|*'value'* / *'disabled'* / *'tpl'*|/|设置参数对应的属性值|
|defineGetter|*'value'* / *'disabled'* / *'tpl'*|返回参数对应的属性值|返回参数对应的属性值|


### 事件

|名称|参数|描述|
|:---------------|:--------|:----------|
|create|外抛的CustomEventObject|组件创建后触发|
|change|外抛的CustomEventObject|通过*setter('value', xxx)*改变组件当前值后触发|
|complete|外抛的CustomEventObject|当前值达到最大值时触发|
|destroy|外抛的CustomEventObject|组件析构后触发|