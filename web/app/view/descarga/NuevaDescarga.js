Ext.define('Descarga.view.descarga.NuevaDescarga', {
    extend: 'Ext.window.Window',
    bind: {
        title: '{titulo}'
    },
    iconCls: 'fa fa-download blue',
    alias: 'widget.nuevaDescarga',
    width: 630,
    modal: true,
    resizable: false,
    viewModel: {
        data: {titulo: 'Nueva Descarga', oculto: true}
    },
    items: [{
            xtype: 'form',
            bodyPadding: 5,
            defaults: {allowBlank: false, labelWidth: 190, width: 610},
            items: [{
                    xtype: 'textfield',
                    name: 'url',
                    vtype: 'url',
                    blankText: 'Debe insertar una direcci\u00f3n para proceder a la descarga',
                    fieldLabel: 'Direcci\u00f3n (URL) de la Descarga',
                    emptyText: 'Inserte Direcci\u00f3n (URL) de la Descarga',
                    allowBlank: false
                }]
        }],
    initComponent: function () {
        this.buttons = [{
                text: 'Insertar',
                scale: 'medium',
                bind: {
                    hidden: '{!oculto}'
                },
                action: 'insertar'
            }, {
                text: 'Modificar',
                scale: 'medium',
                bind: {
                    hidden: '{oculto}'
                },
                action: 'modificar'
            }, {
                text: 'Cancelar',
                scale: 'medium',
                scope: this,
                handler: this.close
            }];
        this.callParent(arguments);
    }
});