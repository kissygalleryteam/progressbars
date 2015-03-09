/**
 * @ignore  =====================================================================================
 * @fileoverview vc-progressbars组件
 * @author  yangren.ry@taobao.com
 * @version 1.0.0
 * @ignore  created in 2015-03-09
 * @ignore  =====================================================================================
 */
var $ = require('node').all;
var Base = require('base');

var Util = {
    typeOf: function (value) {
        return toString.apply(value).replace(/^\[\w*\s*|\]$/ig, '');
    },
    collectionGarbage: function (obj) {
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                delete obj[p];
            }
        }
        return p = obj = obj.__proto__ = null;
    },
    emptyEventFunc: function (e) { }
};

var Progressbars = Base.extend({
    initializer: function () {
        var self = this;
        // 配置
        var selector = self.selector_ = self.get('selector');
        var cssClass = self.cssClass_ = self.get('cssClass');
        var min;
        var max;
        self.min_ = self.get('min');
        self.max_ = self.get('max');
        self.min_ = Math.min(self.min_, self.max_);
        self.max_ = Math.max(self.min_, self.max_);
        min = self.min_;
        max = self.max_;
        var value = self.value_ = self.get('value');
        if (value < min) value = min;
        if (value > max) value = max;
        var percent = self.percent_ = parseInt((value - min) / (max - min) * 100);
        var type = self.type_ = self.get('type');
        var tpl = self.tpl_ = self.get('tpl');
        switch (type) {
            case 'percent':
                tpl = self.tpl_ = '{percent}%';
                break;
            case 'indeterminate':
            case 'loading':
                tpl = self.tpl_ = '';
                break;
        }
        var animate = self.animate_ = self.get('animate');
        var disabled = self.disabled_ = self.get('disabled');
        var hidden = self.hidden_ = false;
        // 事件
        var create = self.create_ = self.get('create') || Util.emptyEventFunc;
        var change = self.change_ = self.get('change') || Util.emptyEventFunc;
        var complete = self.complete_ = self.get('complete') || Util.emptyEventFunc;
        var destroy = self.destroy_ = self.get('destroy') || Util.emptyEventFunc;
        // 对象
        var $progressbar = self.$progressbar = self.get('$target');
        var $progressbar_volume = self.$progressbar_volume = $(selector.volume, $progressbar);

        // 绑定事件
        self.on('create', function (e) {
            create.call(this, e);
        }).on('change', function (e) {
            change.call(this, e);
        }).on('complete', function (e) {
            complete.call(this, e);
        }).on('destroy', function (e) {
            destroy.call(this, e);
        });

        switch (type) {
            case 'value':
                $progressbar.addClass(cssClass.determinate_progressbar);
                if (animate) $progressbar_volume.addClass(cssClass.value_change);
                break;
            case 'percent':
                min = self.min_ = 0;
                max = self.max_ = 100;
                $progressbar.addClass(cssClass.determinate_progressbar);
                if (animate) $progressbar_volume.addClass(cssClass.value_change);
                break;
            case 'indeterminate':
                $progressbar.addClass(cssClass.indeterminate_progressbar).addClass(cssClass.indeterminate_active);
                break;
            case 'loading':
                $progressbar.addClass(cssClass.loading_progressbar).addClass(cssClass.loading_active);
                break;
        }
        self._value(value);
        self._disabled(disabled);
        self._accessible();

        //触发create事件
        self.fire('create');
    },
    _accessible: function (scope) {
        var self = this;
        var $progressbar = self.$progressbar;
        var disabled = self.disabled_;
        var hidden = self.hidden_;
        if (scope === undefined) {
            // 无障碍属性
            $progressbar.attr({
                'role': 'progressbar',
                'aria-disabled': disabled,
                'aria-hidden': hidden
            });
            return;
        }
        var min = self.min_;
        var max = self.max_;
        var percent = self.percent_;
        var value = self.value_;

        // 无障碍属性
        switch (scope) {
            case 'value':
                $progressbar.attr({
                    'aria-valuemin': min,
                    'aria-valuemax': max,
                    'aria-valuenow': value,
                    'aria-valuetext': value,
                    'data-percent': percent
                });
                break;
            case 'disabled':
                $progressbar.attr({
                    'aria-disabled': disabled
                });
                break;
            case 'hidden':
                $progressbar.attr({
                    'aria-hidden': hidden
                });
                break;
        }
    },
    show: function () {
        var self = this;
        var $progressbar = self.$progressbar;
        if (self.animate_) {
            $progressbar.fadeIn();
        } else {
            $progressbar.show();
        }
        self.hidden_ = false;
        self._accessible('hidden');
    },
    hide: function () {
        var self = this;
        var $progressbar = self.$progressbar;
        if (self.animate_) {
            $progressbar.fadeOut();
        } else {
            $progressbar.hide();
        }
        self.hidden_ = true;
        self._accessible('hidden');
    },
    setter: function (prop, value) {
        var self = this;
        switch (prop) {
            case 'value':
                self._value(value);
                break;
            case 'disabled':
                self._disabled(value);
                break;
            case 'tpl':
                self._tpl(value);
                break;
        }
    },
    getter: function (prop) {
        var self = this;
        var result;
        switch (prop) {
            case 'value':
                result = self.value_;
                break;
            case 'disabled':
                result = self.disabled_;
                break;
            case 'tpl':
                result = self.tpl_;
                break;
        }
        return result;
    },
    destroy: function () {
        var self = this;
        var $progressbar = self.$progressbar;
        self.fire('destroy');

        // 删除DOM节点
        $progressbar.remove();
        // 深度清空
        return Util.collectionGarbage(self);
    },
    _tpl: function (value) {
        if (Util.typeOf(value) !== 'String') return;
        var self = this;
        self.tpl_ = value;
    },
    _disabled: function (value) {
        var self = this;
        var $progressbar = self.$progressbar;
        var cssClass = self.cssClass_;
        var type = self.type_;
        switch (value) {
            case true:
                $progressbar.addClass(cssClass.disabled);
                switch (type) {
                    case 'indeterminate':
                        $progressbar.removeClass(cssClass.indeterminate_active);
                        break;
                    case 'loading':
                        $progressbar.removeClass(cssClass.loading_active);
                        break;
                }
                self.disabled_ = true;
                break;
            case false:
                $progressbar.removeClass(cssClass.disabled);
                switch (type) {
                    case 'indeterminate':
                        $progressbar.addClass(cssClass.indeterminate_active);
                        break;
                    case 'loading':
                        $progressbar.addClass(cssClass.loading_active);
                        break;
                }
                self.disabled_ = false;
                break;
        }
        self._accessible('disabled');
    },
    _value: function (value) {
        if (Util.typeOf(value) !== 'Number') return;
        var self = this;
        var type = self.type_;
        var $progressbar_volume = self.$progressbar_volume;
        var min = self.min_;
        var max = self.max_;
        var percent;
        var tpl = self.tpl_;
        if (value < min) value = min;
        if (value > max) value = max;
        self.value_ = value;
        percent = self.percent_ = parseInt((value - min) / (max - min) * 100);
        $progressbar_volume.html(S.substitute(tpl, {
            percent: percent,
            value: value,
            max: max
        }));
        if (type === 'value' || type === 'percent') {
            $progressbar_volume.width(percent + '%');
        }
        self._accessible('value');

        //触发change事件
        self.fire('change');

        if (percent === 100) {
            //触发complete事件
            self.fire('complete');
        }
    }
}, {
    ATTRS: {
        $target: {
            value: '',
            getter: function (v) {
                return $(v);
            }
        },
        selector: {
            value: {
                volume: '.vc-progressbar-volume'
            }
        },
        cssClass: {
            value: {
                determinate_progressbar: 'vc-determinate-progressbar',
                indeterminate_progressbar: 'vc-indeterminate-progressbar',
                indeterminate_active: 'indeterminate-progressbar-active',
                loading_progressbar: 'vc-loading-progressbar',
                loading_active: 'loading-progressbar-active',
                value_change: 'value-change',
                disabled: 'vc-progressbar-disabled'
            }
        },
        min: {
            value: 0 //type='percent'时，min=0；
        },
        max: {
            value: 100 //type='percent'时，max=100；
        },
        value: {
            value: 0
        },
        tpl: {
            value: '{value}/{max}' //type='percent'时，tpl='{percent}%'; type='indeterminate'或type='loading'时，tpl=''；
        },
        type: {
            value: 'value' //type='value/percent/indeterminate/loading'；
        },
        animate: {
            value: true ///animate=true, 执行show()或hide()方法，会显示动画效果；animate=true, 且type='value'或type='percent'时，改变当前值，会显示动画效果；
        },
        disabled: {
            value: false
        }
    }
});

Progressbars.prototype.__defineSetter__('value', function (value) {
    var self = this;
    self._value(value);
});
Progressbars.prototype.__defineSetter__('tpl', function (value) {
    var self = this;
    self._tpl(value);
});
Progressbars.prototype.__defineSetter__('disabled', function (value) {
    var self = this;
    self._disabled(value);
});
Progressbars.prototype.__defineGetter__('value', function () {
    var self = this;
    return self.value_;
});
Progressbars.prototype.__defineGetter__('tpl', function () {
    var self = this;
    return self.tpl_;
});
Progressbars.prototype.__defineGetter__('disabled', function () {
    var self = this;
    return self.disabled_;
});

module.exports = Progressbars;



