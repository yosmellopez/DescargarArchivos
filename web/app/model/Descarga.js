Ext.define('Descarga.model.Descarga', {
    extend: 'Ext.data.Model',
    fields: ['idDescarga', 'url', 'nombre', 'fecha', 'pendiente', 'mensaje', 'ip', 'eliminar', 'descargado'],
    idProperty: 'idDescarga',
    identifier: 'custom'
});
