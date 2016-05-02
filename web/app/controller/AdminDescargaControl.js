Ext.define('Descarga.controller.AdminDescargaControl', {
    extend: 'Ext.app.Controller',
    views: ["descarga.AdminGridDescarga"],
    stores: ['AdminDescargas'],
    models: ['Descarga'],
    refs: [{
            ref: 'grid',
            selector: 'gridDescarga'
        }],
    init: function () {
        this.control({
            'adminGridDescarga button[action=subir]': {
                click: this.subirArchivo
            },
            'adminGridDescarga button[action=modificar]': {
                click: this.modificarBoton
            },
            'adminGridDescarga button[action=insertar]': {
                click: this.insertar
            },
            'nuevaDescarga button[action=modificar]': {
                click: this.modificar
            },
            'gridDescarga': {
                itemdblclick: this.editar,
                cellkeydown: this.eliminarTecla
            },
            'gridDescarga button[action=eliminar]': {
                click: this.eliminar
            }
        });
    },
    subirArchivo: function (button) {
        form = button.up("form");
        form.submit({
            url: 'subirArchivoLog.do'
        });
    },
    insertar: function (buton) {
        win = buton.up('window');
        form = win.down('form');
        basicForm = form.getForm();
        if (basicForm.isValid()) {
            store = this.getDescargasStore();
            valores = basicForm.getValues();
            record = Ext.create('Descarga.model.Descarga', valores);
            store.add(record);
            win.setLoading('Insertando descarga...');
            store.sync({
                success: function () {
                    Ext.Msg.show({
                        title: 'Informaci\u00f3n',
                        msg: 'Su descarga se encuentra pendiente hasta que verifiquemos si cumple con los requerimientos de descarga',
                        icon: Ext.Msg.INFO,
                        buttons: Ext.Msg.OK
                    });
                    win.close();
                    operando = false;
                },
                failure: function (action) {
                    Ext.Msg.show({
                        title: 'Informaci\u00f3n',
                        msg: action.proxy.reader,
                        icon: Ext.Msg.INFO,
                        buttons: Ext.Msg.OK
                    });
                    store.rejectChanges();
                    win.setLoading(false);
                }
            });
        } else {
            campos = basicForm.getFields();
            var msg = '<div>';
            campos.each(function (campo) {
                errores = campo.getErrors();
                errores.forEach(function (error) {
                    msg += '<b>' + campo.getFieldLabel() + '</b>: ' + error + '<br/>';
                });
            });
            msg += '</div>';
            Ext.toast({html: msg, align: 't', y: 200, autoCloseDelay: 6000});
        }
    },
    modificarBoton: function (boton) {
        grid = boton.up('grid');
        seleccion = grid.getSelectionModel().getSelection();
        if (seleccion.length !== 0) {
            this.editar(grid, seleccion[0]);
            operando = true;
        } else {
            Ext.Msg.show({
                title: 'Informaci\u00f3n',
                icon: Ext.Msg.INFO,
                msg: 'Para modificar debe seleccionar un registro.',
                buttons: Ext.Msg.OK
            });
        }
    },
    editar: function (grid, record) {
        win = Ext.widget('nuevaDescarga').show(grid);
        vm = win.getViewModel();
        vm.setData({titulo: 'Modificar Descarga', oculto: false});
        form = win.down('form');
        form.loadRecord(record);
        operando = true;
    },
    modificar: function (button) {
        win = button.up('window');
        form = win.down('form');
        basicForm = form.getForm();
        if (basicForm.isValid()) {
            valores = form.getValues();
            record = form.getRecord();
            record.set(valores);
            store = this.getDescargasStore();
            if (record.dirty)
                win.setLoading('Modificando descarga...');
            store.sync({
                success: function () {
                    Ext.Msg.show({
                        title: 'Informaci\u00f3n',
                        msg: 'Descarga modificada exitosamente',
                        icon: Ext.Msg.INFO,
                        buttons: Ext.Msg.OK
                    });
                    win.close();
                    operando = false;
                },
                failure: function (action) {
                    store.rejectChanges();
                    Ext.Msg.show({
                        title: 'Informaci\u00f3n',
                        msg: action.proxy.reader,
                        icon: Ext.Msg.INFO,
                        buttons: Ext.Msg.OK
                    });
                    win.setLoading(false);
                }
            });
        } else {
            campos = basicForm.getFields();
            var msg = '<div>';
            campos.each(function (campo) {
                errores = campo.getErrors();
                errores.forEach(function (error) {
                    msg += '<b>' + campo.getFieldLabel() + '</b>: ' + error + '<br/>';
                });
            });
            msg += '</div>';
            Ext.Msg.show({
                icon: Ext.Msg.INFO,
                msg: 'El formulario contiene errores marcados en rojo.<br/>Verif\u00edquelos',
                buttons: Ext.Msg.OK,
                title: 'Informaci\u00f3n'
            });
            Ext.toast({html: msg, align: 't', y: 200, autoCloseDelay: 6000});
        }
    },
    eliminar: function () {
        operando = true;
        grid = this.getGrid();
        records = grid.getSelectionModel().getSelection();
        if (records.length !== 0) {
            store = this.getDescargasStore();
            n = records.length;
            sp = (records.length === 1 ? ' descarga' : ' descargas');
            mensaje = 'Est\u00e1 a punto de eliminar ' + n + sp + '</br>¿Desea continuar?';
            Ext.Msg.show({
                title: 'Informaci\u00f3n',
                msg: mensaje,
                icon: Ext.Msg.QUESTION,
                buttons: Ext.Msg.OKCANCEL,
                buttonText: new Object({
                    ok: "Si",
                    cancel: "No"
                }),
                fn: function (btn) {
                    if (btn === 'ok') {
                        store.remove(records);
                        np = records.length === 1;
                        grid.setLoading('Eliminando descarga' + (n === 1 ? '' : 'es') + '...');
                        store.sync({
                            success: function () {
                                grid.setLoading(false);
                                Ext.Msg.show({
                                    title: 'Informaci\u00f3n',
                                    msg: 'Registros eliminados exitosamente',
                                    icon: Ext.Msg.INFO,
                                    buttons: Ext.Msg.OK
                                });
                                operando = false;
                            },
                            failure: function (action) {
                                store.rejectChanges();
                                Ext.Msg.show({
                                    title: 'Informaci\u00f3n',
                                    msg: action.proxy.reader,
                                    icon: Ext.Msg.INFO,
                                    buttons: Ext.Msg.OK
                                });
                                grid.setLoading(false);
                            }
                        });
                    }
                }
            });
        } else {
            Ext.Msg.show({
                title: 'Informaci\u00f3n',
                msg: 'No existen filas seleccionadas',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.INFO
            });
        }
    },
    eliminarTecla: function (grid, td, cellIndex, record, tr, rowIndex, e) {
        if (e.getKey() === 46)
            this.eliminar();
    }
});