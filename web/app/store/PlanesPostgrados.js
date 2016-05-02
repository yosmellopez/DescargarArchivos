Ext.define('Postgrado.store.PlanesPostgrados', {
    extend: 'Ext.data.Store',
    model: 'Postgrado.model.PlanPostgrado',
    autoLoad: true,
    pageSize: 20,
    proxy: {
        type: 'rest',
        url: 'planPostgrado.json',
        reader: {type: 'json', rootProperty: 'lista'},
        writer: {type: 'json', writeAllFields: true},
        extraParams: {fecha: Ext.Date.format(new Date(), 'Y')},
        listeners: {
            exception: function (reader, response, operacion) {
                msg = '';
                error = false;
                if (response.timedout) {
                    msg = 'Se ha abortado la conexi\u00f3n por demoras en el servidor';
                    error = true
                } else {
                    switch (response.status) {
                        case 500:
                            error = true;
                            if (operacion.action === "read")msg = 'Ocurrió un error interno del servidor al listar los planes de postgrados'; else if (operacion.action === "create")msg = 'Ocurrió un error interno del servidor al insertar el plan de postgrado'; else if (operacion.action === "update")msg = 'Ocurrió un error interno del servidor al modificar el plan de postgrado'; else  msg = 'Ocurrió un error interno del servidor al eliminar el o los planes de postgrado';
                            break;
                        case 200:
                            msg = Ext.decode(response.responseText).msg;
                            error = true;
                            break
                    }
                }
                if (error)Ext.Msg.show({title: 'Informaci\u00f3n', icon: Ext.Msg.ERROR, msg: msg, buttons: Ext.Msg.OK})
            }
        }
    }
});