Ext.define('Postgrado.plugins.Picker', {
    extend: 'Ext.Widget',
    xtype: 'rating',
    focusable: true,
    cachedConfig: {
        family: 'monospace',
        glyphs: '☆★',
        minimum: 1,
        limit: 5,
        overStyle: null,
        rounding: 1,
        scale: '125%',
        selectedStyle: null,
        tooltip: null,
        trackOver: true,
        value: null,
        tooltipText: null,
        trackingValue: null
    },
    config: {animate: null},
    element: {
        cls: 'u' + Ext.baseCSSPrefix + 'rating-picker',
        reference: 'element',
        children: [{
            reference: 'innerEl',
            cls: 'u' + Ext.baseCSSPrefix + 'rating-picker-inner',
            listeners: {
                click: 'onClick',
                mousemove: 'onMouseMove',
                mouseenter: 'onMouseEnter',
                mouseleave: 'onMouseLeave'
            },
            children: [{
                reference: 'valueEl',
                cls: 'u' + Ext.baseCSSPrefix + 'rating-picker-value'
            }, {reference: 'trackerEl', cls: 'u' + Ext.baseCSSPrefix + 'rating-picker-tracker'}]
        }]
    },
    defaultBindProperty: 'value',
    twoWayBindable: 'value',
    overCls: 'u' + Ext.baseCSSPrefix + 'rating-picker-over',
    trackOverCls: 'u' + Ext.baseCSSPrefix + 'rating-picker-track-over',
    applyGlyphs: function (value) {
        if (typeof value === 'string') {
            if (value.length !== 2) {
                Ext.raise('Expected 2 characters for "glyphs" not "' + value + '".')
            }
            value = [value.charAt(0), value.charAt(1)]
        } else if (typeof value[0] === 'number') {
            value = [String.fromCharCode(value[0]), String.fromCharCode(value[1])]
        }
        return value
    },
    applyOverStyle: function (style) {
        this.trackerEl.applyStyles(style)
    },
    applySelectedStyle: function (style) {
        this.valueEl.applyStyles(style)
    },
    applyTooltip: function (tip) {
        if (tip && typeof tip !== 'function') {
            if (!tip.isTemplate) {
                tip = new Ext.XTemplate(tip)
            }
            tip = tip.apply.bind(tip)
        }
        return tip
    },
    applyTrackingValue: function (value) {
        return this.applyValue(value)
    },
    applyValue: function (v) {
        if (v !== null) {
            var rounding = this.getRounding(), limit = this.getLimit(), min = this.getMinimum();
            v = Math.round(Math.round(v / rounding) * rounding * 1000) / 1000;
            v = (v < min) ? min : (v > limit ? limit : v)
        }
        return v
    },
    onClick: function (event) {
        var value = this.valueFromEvent(event);
        this.setValue(value)
    },
    onMouseEnter: function () {
        this.element.addCls(this.overCls)
    },
    onMouseLeave: function () {
        this.element.removeCls(this.overCls)
    },
    onMouseMove: function (event) {
        var value = this.valueFromEvent(event);
        this.setTrackingValue(value)
    },
    updateFamily: function (family) {
        this.element.setStyle('fontFamily', "'" + family + "'")
    },
    updateGlyphs: function () {
        this.refreshGlyphs()
    },
    updateLimit: function () {
        this.refreshGlyphs()
    },
    updateScale: function (size) {
        this.element.setStyle('fontSize', size)
    },
    updateTooltip: function () {
        this.refreshTooltip()
    },
    updateTooltipText: function (text) {
        var innerEl = this.innerEl, QuickTips = Ext.tip && Ext.tip.QuickTipManager, tip = QuickTips && QuickTips.tip, target;
        if (QuickTips) {
            innerEl.dom.setAttribute('data-qtip', text);
            this.trackerEl.dom.setAttribute('data-qtip', text);
            target = tip && tip.activeTarget;
            target = target && target.el;
            if (target && innerEl.contains(target)) {
                tip.update(text)
            }
        }
    },
    updateTrackingValue: function (value) {
        var me = this, trackerEl = me.trackerEl, newWidth = me.valueToPercent(value);
        trackerEl.setStyle('width', newWidth);
        me.refreshTooltip()
    },
    updateTrackOver: function (trackOver) {
        this.element[trackOver ? 'addCls' : 'removeCls'](this.trackOverCls)
    },
    updateValue: function (value, oldValue) {
        var me = this, animate = me.getAnimate(), valueEl = me.valueEl, newWidth = me.valueToPercent(value), column, record;
        if (me.isConfiguring || !animate) {
            valueEl.setStyle('width', newWidth)
        } else {
            valueEl.stopAnimation();
            valueEl.animate(Ext.merge({from: {width: me.valueToPercent(oldValue)}, to: {width: newWidth}}, animate))
        }
        me.refreshTooltip();
        if (!me.isConfiguring) {
            if (me.hasListeners.change) {
                me.fireEvent('change', me, value, oldValue)
            }
            column = me.getWidgetColumn && me.getWidgetColumn();
            record = column && me.getWidgetRecord && me.getWidgetRecord();
            if (record && column.dataIndex) {
                record.set(column.dataIndex, value)
            }
        }
    },
    afterCachedConfig: function () {
        this.refresh();
        return this.callParent(arguments)
    },
    initConfig: function (instanceConfig) {
        this.isConfiguring = true;
        this.callParent([instanceConfig]);
        this.refresh()
    },
    setConfig: function () {
        var me = this;
        me.isReconfiguring = true;
        me.callParent(arguments);
        me.isReconfiguring = false;
        me.refresh();
        return me
    },
    destroy: function () {
        this.tip = Ext.destroy(this.tip);
        this.callParent()
    },
    privates: {
        getGlyphTextNode: function (dom) {
            var node = dom.lastChild;
            if (!node || node.nodeType !== 3) {
                node = dom.ownerDocument.createTextNode('');
                dom.appendChild(node)
            }
            return node
        }, getTooltipData: function () {
            var me = this;
            return {component: me, tracking: me.getTrackingValue(), trackOver: me.getTrackOver(), value: me.getValue()}
        }, refresh: function () {
            var me = this;
            if (me.invalidGlyphs) {
                me.refreshGlyphs(true)
            }
            if (me.invalidTooltip) {
                me.refreshTooltip(true)
            }
        }, refreshGlyphs: function (now) {
            var me = this, later = !now && (me.isConfiguring || me.isReconfiguring), el, glyphs, limit, on, off, trackerEl, valueEl;
            if (!later) {
                el = me.getGlyphTextNode(me.innerEl.dom);
                valueEl = me.getGlyphTextNode(me.valueEl.dom);
                trackerEl = me.getGlyphTextNode(me.trackerEl.dom);
                glyphs = me.getGlyphs();
                limit = me.getLimit();
                for (on = off = ''; limit--;) {
                    off += glyphs[0];
                    on += glyphs[1]
                }
                el.nodeValue = off;
                valueEl.nodeValue = on;
                trackerEl.nodeValue = on
            }
            me.invalidGlyphs = later
        }, refreshTooltip: function (now) {
            var me = this, later = !now && (me.isConfiguring || me.isReconfiguring), tooltip = me.getTooltip(), data, text;
            if (!later) {
                tooltip = me.getTooltip();
                if (tooltip) {
                    data = me.getTooltipData();
                    text = tooltip(data);
                    me.setTooltipText(text)
                }
            }
            me.invalidTooltip = later
        }, valueFromEvent: function (event) {
            var me = this, el = me.innerEl, ex = event.getX(), rounding = me.getRounding(), cx = el.getX(), x = ex - cx, w = el.getWidth(), limit = me.getLimit(), v;
            if (me.getInherited().rtl) {
                x = w - x
            }
            v = x / w * limit;
            v = Math.ceil(v / rounding) * rounding;
            return v
        }, valueToPercent: function (value) {
            value = (value / this.getLimit()) * 100;
            return value + '%'
        }
    }
});