Ext.application({
    name: 'Descarga',
    appFolder: appFolder,
    controllers: ['AdminDescargaControl'],
    requires:['Descarga.model.identificador.Identificador'],
    launch: function () {
        Ext.create('Ext.container.Container', {
            layout: 'fit',
            renderTo: 'centro',
            items: [{
                    xtype: 'panel',
                    items: [{
                            xtype: 'adminGridDescarga'
                        }]
                }]
        });
    }
});