Ext.define('Descarga.view.descarga.BusquedaDescarga', {
    extend: 'Ext.form.Panel',
    title: 'Buscar Planes de Posgrados',
    alias: 'widget.busquedaDescarga',
    width: 470,
    collapsible: true,
    iconCls: 'fa fa-search-plus blue',
    bodyPadding: 5,
    collapsed: true,
    titleCollapse: true,
    layout: {type: 'hbox', defaultMargins: {right: 10}},
    initComponent: function () {
        this.items = [{
                xtype: 'panel',
                border: 0,
                flex: 1.5,
                layout: {type: 'anchor'},
                defaults: {labelWidth: 150, width: 400, anchor: '100%'},
                items: [{
                        xtype: 'combo',
                        store: 'Sedes',
                        name: 'joinJfacultad.sede.idSede',
                        fieldLabel: 'Sede',
                        displayField: 'nombre',
                        valueField: 'idSede',
                        queryMode: 'local',
                        emptyText: 'Seleccionar Sede',
                        action: 'seleccionar'
                    }, {
                        xtype: 'combo',
                        store: 'Facultades',
                        name: 'facultad.idFacultad',
                        fieldLabel: 'Facultad',
                        displayField: 'nombre',
                        valueField: 'idFacultad',
                        queryMode: 'local',
                        emptyText: 'Seleccione Facultad'
                    }, {
                        xtype: 'textfield',
                        name: 'likeLtitulo',
                        fieldLabel: 'T\u00edtulo del Posgrado',
                        emptyText: 'Inserte T\u00edtulo del Posgrado'
                    }]
            }, {
                xtype: 'fieldset',
                border: 0,
                flex: 1,
                title: 'Rango de Fechas de Inicio',
                layout: {type: 'anchor'},
                defaults: {labelWidth: 100, anchor: '100%'},
                items: [{
                        xtype: 'datefield',
                        name: 'rangoIfechaInicio',
                        fieldLabel: 'Fecha Inicial',
                        emptyText: 'Seleccione fecha inicial'
                    }, {
                        xtype: 'datefield',
                        name: 'rangoFfechaInicio',
                        fieldLabel: 'Fecha Final',
                        emptyText: 'Seleccione fecha final'
                    }]
            }, {
                xtype: 'fieldset',
                border: 0,
                flex: 1,
                title: 'Rango de Fechas de Terminaci\u00f3n',
                layout: {type: 'anchor'},
                defaults: {labelWidth: 100, anchor: '100%'},
                items: [{
                        xtype: 'datefield',
                        name: 'rangoIfechaFin',
                        fieldLabel: 'Fecha Inicial',
                        emptyText: 'Seleccione fecha inicial'
                    }, {
                        xtype: 'datefield',
                        name: 'rangoFfechaFin',
                        fieldLabel: 'Fecha Final',
                        emptyText: 'Seleccione fecha final'
                    }]
            }];
        this.buttons = [{
                text: 'Buscar',
                scale: 'medium',
                iconCls: 'fa fa-search-plus fa-1-2x blue',
                action: 'buscar'
            }, {
                text: 'Limpiar',
                scope: this,
                iconCls: 'fa fa-eraser fa-1-2x blue',
                scale: 'medium',
                handler: function (bot) {
                    bot.up('form').getForm().reset();
                }
            }];
        this.callParent(arguments);
    },
    listeners: {
        collapse: function (panel) {
            grid = panel.up('grid');
            altura = grid.getHeight();
            centro = Ext.get('panelcentro');
            grid.animate({duration: 100, from: {height: altura}, to: {height: altura - 270}});
            centro.animate({duration: 100, from: {height: altura}, to: {height: altura - 240}})
        }, expand: function (panel) {
            grid = panel.up('grid');
            altura = grid.getHeight();
            centro = Ext.get('panelcentro');
            grid.animate({duration: 100, from: {height: altura}, to: {height: altura + 270}});
            centro.animate({duration: 100, from: {height: altura}, to: {height: altura + 300}})
        }
    }
});