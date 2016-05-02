Ext.define('Postgrado.plugins.DragSelector', {
    requires: ['Ext.dd.DragTracker', 'Ext.util.Region'],
    init: function (dataview) {
        this.dataview = dataview;
        dataview.mon(dataview, {
            beforecontainerclick: this.cancelClick,
            scope: this,
            render: {fn: this.onRender, scope: this, single: true}
        })
    },
    onRender: function () {
        this.tracker = Ext.create('Ext.dd.DragTracker', {
            dataview: this.dataview,
            el: this.dataview.el,
            dragSelector: this,
            onBeforeStart: this.onBeforeStart,
            onStart: this.onStart,
            onDrag: this.onDrag,
            onEnd: this.onEnd
        });
        this.dragRegion = Ext.create('Ext.util.Region')
    },
    onBeforeStart: function (e) {
        return e.target === this.dataview.getEl().dom
    },
    onStart: function (e) {
        var dragSelector = this.dragSelector, dataview = this.dataview;
        this.dragging = true;
        dragSelector.fillRegions();
        dragSelector.getProxy().show();
        dataview.getSelectionModel().deselectAll()
    },
    cancelClick: function () {
        return !this.tracker.dragging
    },
    onDrag: function (e) {
        var dragSelector = this.dragSelector, selModel = dragSelector.dataview.getSelectionModel(), dragRegion = dragSelector.dragRegion, bodyRegion = dragSelector.bodyRegion, proxy = dragSelector.getProxy(), regions = dragSelector.regions, length = regions.length, startXY = this.startXY, currentXY = this.getXY(), minX = Math.min(startXY[0], currentXY[0]), minY = Math.min(startXY[1], currentXY[1]), width = Math.abs(startXY[0] - currentXY[0]), height = Math.abs(startXY[1] - currentXY[1]), region, selected, i;
        Ext.apply(dragRegion, {top: minY, left: minX, right: minX + width, bottom: minY + height});
        dragRegion.constrainTo(bodyRegion);
        proxy.setBox(dragRegion);
        for (i = 0; i < length; i++) {
            region = regions[i];
            selected = dragRegion.intersect(region);
            if (selected) {
                selModel.select(i, true)
            } else {
                selModel.deselect(i)
            }
        }
    },
    onEnd: Ext.Function.createDelayed(function (e) {
        var dataview = this.dataview, selModel = dataview.getSelectionModel(), dragSelector = this.dragSelector;
        this.dragging = false;
        dragSelector.getProxy().hide()
    }, 1),
    getProxy: function () {
        if (!this.proxy) {
            this.proxy = this.dataview.getEl().createChild({tag: 'div', cls: 'x-view-selector'})
        }
        return this.proxy
    },
    fillRegions: function () {
        var dataview = this.dataview, regions = this.regions = [];
        dataview.all.each(function (node) {
            regions.push(node.getRegion())
        });
        this.bodyRegion = dataview.getEl().getRegion()
    }
});