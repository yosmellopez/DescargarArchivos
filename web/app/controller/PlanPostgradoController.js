Ext.define('Postgrado.controller.PlanPostgradoController', {
    extend: 'Ext.app.Controller',
    views: ['planPostgrado.GridPlanPostgrado', 'planPostgrado.NuevoPlanPostgrado', 'planPostgrado.ModificarPlanPostgrado', 'planPostgrado.BusquedaPlanPostgrado'],
    stores: ['PlanesPostgrados', 'Sedes', 'Facultades', 'Tipos', 'Organismos'],
    models: ['PlanPostgrado', 'Sede', 'Facultad', 'Tipo', 'Organismo'],
    refs: [{ref: 'grid', selector: 'gridplanpostgrado'}],
    init: function () {
        this.control({
            'gridplanpostgrado button[action=nuevo]': {click: this.nuevo},
            'gridplanpostgrado button[action=modificar]': {click: this.modificarBoton},
            'nuevoplanpostgrado button[action=insertar]': {click: this.insertar},
            'nuevoplanpostgrado combo[action=filtrarFacultades]': {select: this.filtrarFacultades},
            'busquedaplanpostgrado combo[action=seleccionar]': {select: this.filtrarFacultades},
            'busquedaplanpostgrado button[action=buscar]': {click: this.buscarPlanes},
            'gridplanpostgrado': {
                itemdblclick: this.editar,
                cellkeydown: this.eliminarTecla,
                itemcontextmenu: this.mostrarMenu
            },
            'modificarplanpostgrado button[action=modificar]': {click: this.modificar},
            'gridplanpostgrado button[action=eliminar]': {click: this.eliminar},
            'menu menuitem[action=menuAction]': {click: this.ejecutarMenu},
            'gridplanpostgrado button[action=nuevoPostgrado]': {click: this.nuevoPostgrado}
        })
    },
    nuevo: function (button) {
        win = Ext.widget('nuevoplanpostgrado');
        win.show(button)
    },
    nuevoPostgrado: function (bot) {
        grid = this.getGrid();
        seleccion = grid.getSelectionModel().getSelection();
        if (seleccion.length !== 0) {
            win = Ext.widget('nuevopostgrado');
            form = win.down('form');
            record = seleccion[0];
            form.loadRecord(record);
            cmb = form.down('[name=facultad]');
            form.down('[name=tipo]').select(record.getTipo());
            cmbEstado = form.down('[name=estado]');
            cmbEstado.select(cmbEstado.getStore().getAt(2));
            cmb.select(record.getFacultad());
            stOrg = Ext.create('Postgrado.store.Organismos');
            stOrg.add(record.get('organismos'));
            form.down('[name=organismos]').select(stOrg.getRange());
            cbDep = cmb.next();
            st = cbDep.getStore();
            st.filter({
                filterFn: function (reg) {
                    return reg.get('facultad').idFacultad === cmb.getValue()
                }
            });
            win.show(bot);
            vm = win.getViewModel();
            vm.setData({vienePlan: true, horas: 0, idPlan: record.getId(), creditos: record.get('creditos')})
        } else {
            Ext.Msg.show({
                title: 'Informaci\u00f3n',
                icon: Ext.Msg.INFO,
                msg: 'Debe seleccionar un plan para insertar el posgrado',
                buttons: Ext.Msg.OK
            })
        }
    },
    insertar: function (buton) {
        win = buton.up('window');
        form = win.down('form');
        basicForm = form.getForm();
        if (basicForm.isValid()) {
            store = this.getPlanesPostgradosStore();
            valores = basicForm.getValues();
            record = Ext.create('Postgrado.model.PlanPostgrado', valores);
            record.setTipo(this.getTiposStore().getById(valores.tipo.idTipo));
            record.setFacultad(this.getFacultadesStore().getById(valores.facultad.idFacultad));
            store.add(record);
            win.setLoading('Insertando plan de posgrado...');
            store.sync({
                success: function () {
                    Ext.Msg.show({
                        title: 'Informaci\u00f3n',
                        msg: 'Plan de posgrado insertado exitosamente',
                        icon: Ext.Msg.INFO,
                        buttons: Ext.Msg.OK
                    });
                    win.close()
                }, failure: function (action) {
                    Ext.Msg.show({
                        title: 'Informaci\u00f3n',
                        msg: action.proxy.reader,
                        icon: Ext.Msg.INFO,
                        buttons: Ext.Msg.OK
                    });
                    store.rejectChanges();
                    win.setLoading(false)
                }
            })
        } else {
            campos = basicForm.getFields();
            var msg = '<div>';
            campos.each(function (campo) {
                errores = campo.getErrors();
                errores.forEach(function (error) {
                    msg += '<b>' + campo.getFieldLabel() + '</b>:' + error + '<br/>'
                })
            });
            msg += '</div>';
            Ext.Msg.show({
                icon: Ext.Msg.INFO,
                msg: 'El formulario contiene errores marcados en rojo.<br/>Verif\u00edquelos',
                buttons: Ext.Msg.OK,
                title: 'Informaci\u00f3n'
            });
            Ext.toast({html: msg, align: 't', y: 200, autoCloseDelay: 6000})
        }
    },
    modificarBoton: function (boton) {
        grid = boton.up('grid');
        seleccion = grid.getSelectionModel().getSelection();
        if (seleccion.length !== 0) {
            this.editar(grid, seleccion[0])
        } else {
            Ext.Msg.show({
                title: 'Informaci\u00f3n',
                icon: Ext.Msg.INFO,
                msg: 'Para modificar debe seleccionar un registro.',
                buttons: Ext.Msg.OK
            })
        }
    },
    editar: function (grid, record) {
        win = Ext.widget('modificarplanpostgrado').show(grid);
        form = win.down('form');
        form.loadRecord(record);
        cbSede = form.down('[name=sede]');
        cbSede.select(cbSede.getStore().getById(record.get('facultad').sede.idSede));
        this.filtrarFacultades(cbSede);
        cbFac = form.down('[name=facultad]');
        cbFac.select(record.getFacultad());
        form.down('[name=tipo]').select(record.getTipo());
        stOrg = Ext.create('Postgrado.store.Organismos');
        stOrg.add(record.get('organismos'));
        form.down('[name=organismos]').select(stOrg.getRange())
    },
    modificar: function (button) {
        win = button.up('window');
        form = win.down('form');
        basicForm = form.getForm();
        if (basicForm.isValid()) {
            valores = form.getValues();
            record = form.getRecord();
            record.set(valores);
            record.setTipo(this.getTiposStore().getById(valores.tipo.idTipo));
            record.setFacultad(this.getFacultadesStore().getById(valores.facultad.idFacultad));
            store = this.getPlanesPostgradosStore();
            if (record.dirty)win.setLoading('Modificando plan de postgrado...');
            store.sync({
                success: function () {
                    Ext.Msg.show({
                        title: 'Informaci\u00f3n',
                        msg: 'Plan de postgrado guardado exitosamente',
                        icon: Ext.Msg.INFO,
                        buttons: Ext.Msg.OK
                    });
                    win.close()
                }, failure: function (action) {
                    store.rejectChanges();
                    Ext.Msg.show({
                        title: 'Informaci\u00f3n',
                        msg: action.proxy.reader,
                        icon: Ext.Msg.INFO,
                        buttons: Ext.Msg.OK
                    });
                    win.setLoading(false)
                }
            })
        } else {
            campos = basicForm.getFields();
            var msg = '<div>';
            campos.each(function (campo) {
                errores = campo.getErrors();
                errores.forEach(function (error) {
                    msg += '<b>' + campo.getFieldLabel() + '</b>:' + error + '<br/>'
                })
            });
            msg += '</div>';
            Ext.Msg.show({
                icon: Ext.Msg.INFO,
                msg: 'El formulario contiene errores marcados en rojo.<br/>Verif\u00edquelos',
                buttons: Ext.Msg.OK,
                title: 'Informaci\u00f3n'
            });
            Ext.toast({html: msg, align: 't', y: 200, autoCloseDelay: 6000})
        }
    },
    eliminar: function () {
        grid = this.getGrid();
        records = grid.getSelectionModel().getSelection();
        if (records.length !== 0) {
            store = this.getPlanesPostgradosStore();
            n = records.length;
            sp = (records.length === 1 ? ' registro' : ' registros');
            mensaje = 'Est\u00e1 a punto de eliminar ' + n + sp + '</br>¿Desea continuar?';
            Ext.Msg.show({
                title: 'Informaci\u00f3n',
                msg: mensaje,
                icon: Ext.Msg.QUESTION,
                buttons: Ext.Msg.OKCANCEL,
                buttonText: new Object({ok: "Si", cancel: "No"}),
                fn: function (btn) {
                    if (btn === 'ok') {
                        store.remove(records);
                        np = records.length === 1;
                        grid.setLoading('Eliminando plan de postgrado' + (n === 1 ? '' : 'es') + '...');
                        store.sync({
                            success: function () {
                                grid.setLoading(false);
                                Ext.Msg.show({
                                    title: 'Informaci\u00f3n',
                                    msg: 'Registros eliminados exitosamente',
                                    icon: Ext.Msg.INFO,
                                    buttons: Ext.Msg.OK
                                })
                            }, failure: function (action) {
                                store.rejectChanges();
                                Ext.Msg.show({
                                    title: 'Informaci\u00f3n',
                                    msg: action.proxy.reader,
                                    icon: Ext.Msg.INFO,
                                    buttons: Ext.Msg.OK
                                });
                                grid.setLoading(false)
                            }
                        })
                    }
                }
            })
        } else {
            Ext.Msg.show({
                title: 'Informaci\u00f3n',
                msg: 'No existen filas seleccionadas',
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.INFO
            })
        }
    },
    eliminarTecla: function (grid, td, cellIndex, record, tr, rowIndex, e) {
        if (e.getKey() === 46)this.eliminar()
    },
    filtrarFacultades: function (combo) {
        cbFac = combo.next();
        cbFac.clearValue();
        stFac = cbFac.getStore();
        stFac.clearFilter();
        stFac.filter({
            filterFn: function (reg) {
                return reg.get('sede').idSede === combo.getValue()
            }
        })
    },
    buscarPlanes: function (bot) {
        grid = bot.up('grid');
        form = bot.up('form');
        valores = form.getValues();
        store = grid.getStore();
        store.load({params: {parametros: Ext.JSON.encode(valores)}})
    },
    mostrarMenu: function (grid, record, item, index, e) {
        e.stopEvent();
        menu = Ext.create('Ext.menu.Menu', {
            width: 220,
            margin: '0 0 10 0',
            viewModel: {data: {registro: record}},
            items: [{
                text: 'Insertar Postgrado',
                iconCls: 'fa fa-plus-circle blue fa-1-2x bajar-2x',
                action: 'menuAction',
                accion: 1
            }, {
                text: 'Eliminar Plan de Posgrado',
                iconCls: 'fa fa-trash blue fa-1-2x bajar-2x',
                action: 'menuAction',
                accion: 2
            }, {
                text: 'Modificar Plan de Posgrado',
                iconCls: 'fa fa-edit blue fa-1-2x bajar-2x',
                action: 'menuAction',
                accion: 3
            }]
        });
        menu.showAt(e.getXY())
    },
    ejecutarMenu: function (menuItem) {
        menu = menuItem.up('menu');
        vm = menu.getViewModel();
        record = vm.getData().registro;
        switch (menuItem.accion) {
            case 1:
                this.nuevoPostgrado(menuItem);
                break;
            case 2:
                this.eliminar();
                break;
            case 3:
                this.editar(this.getGrid(), record);
                break
        }
    }
});