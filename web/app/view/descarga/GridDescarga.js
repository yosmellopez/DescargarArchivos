Ext.define('Descarga.view.descarga.GridDescarga', {
    extend: 'Ext.grid.Panel',
    height: window.screen.availHeight - 70,
    store: 'Descargas',
    title: '<span style="font-size: 20px;font-weight:500px"><i style="margin-right:5px;" class="fa fa-download"></i>Lista de Descargas de Profesores ULT</span>',
    alias: 'widget.gridDescarga',
    selType: 'checkboxmodel',
    forceFit: true,
    flex: 1,
    dockedItems: [{
            xtype: 'toolbar',
            items: [{
                    xtype: 'button',
                    text: 'Nueva Descarga',
                    scale: 'medium',
                    action: 'nuevo',
                    iconCls: 'fa fa-plus-circle blue fa-1-3x'
                }, {
//                    xtype: 'button',
//                    text: 'Modificar Descarga',
//                    scale: 'medium',
//                    action: 'modificar',
//                    iconCls: 'fa fa-edit blue fa-1-3x'
//                }, {
                    xtype: 'button',
                    text: 'Eliminar',
                    scale: 'medium',
                    action: 'eliminar',
                    iconCls: 'fa fa-trash blue fa-1-3x'
                }]
        }],
    bbar: [{
            xtype: 'pagingtoolbar',
            store: 'Descargas',
            beforePageText: 'P\u00e1gina',
            afterPageText: 'de {0}',
            displayMsg: 'Mostrando {0} - {1} de {2}',
            displayInfo: true,
            pageSize: 22,
            refreshText: 'Actualizar',
            width: '100%'
        }],
    header: {
        xtype: 'header',
        layout: 'hbox',
        items: [{
                xtype: 'button',
                text: nombreCompleto,
                scale: 'medium',
                tooltip: 'Cerrar Sesi\u00f3n ' + nombreCompleto,
                iconCls: 'fa fa-power-off',
                handler: function () {
                    window.location.replace("salir.html");
                }
            }]
    },
    enableLocking: true,
    plugins: [{
            ptype: 'rowexpander',
            rowBodyTpl: new Ext.XTemplate('<tpl for="."><p><b>Mensaje: {mensaje}</></p></tpl>')
        }],
    initComponent: function () {
        this.columns = [{
                xtype: 'rownumberer',
                width: 40
            }, {
                header: 'Direcci\u00f3n de Descarga',
                dataIndex: 'url',
                flex: 2.5
            }, {
                header: 'Fecha',
                dataIndex: 'fecha',
                flex: 1
            }, {
                header: 'Usuario',
                dataIndex: 'usuario',
                sorter: {
                    sorterFn: function (a, b) {
                        u1 = a.get('usuario').usuario;
                        u2 = b.get('usuario').usuario;
                        return u1 > u2 ? 1 : u1 > u2 ? 0 : -1;
                    }
                },
                renderer: function (obj) {
                    return obj === undefined ? usuario : obj.usuario;
                },
                flex: 0.4
            }, {
                xtype: 'templatecolumn',
                header: 'Estado',
                dataIndex: 'pendiente',
                flex: 0.4,
                tpl: new Ext.XTemplate('<tpl for="."><tpl if="descargado"><a href="http://10.22.0.54/Descargas_Programadas/{nombre}" target="_new"><i class="fa fa-download"></i>  Descargar</a><tpl else><tpl if="eliminar"><i class="fa fa-remove"></i>  Eliminar<tpl else><tpl if="pendiente">Pendiente<tpl else><i class="fa fa-upload"></i>  Insertada</tpl></tpl></tpl></tpl>')
            }];
        this.callParent(arguments);
        Ext.create('Ext.LoadMask', {target: this, msg: 'Cargando lista de descargas...', store: this.getStore()});
    }
});