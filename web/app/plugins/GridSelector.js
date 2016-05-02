Ext.define('Postgrado.plugins.GridSelector', {
    extend: 'Ext.form.FieldContainer',
    mixins: {bindable: 'Ext.mixin.Bindable', field: 'Ext.form.field.Field'},
    alternateClassName: 'Postgrado.plugins.GridSelector',
    classFrom: '',
    classTo: '',
    modelFrom: '',
    widthFrom: 0,
    widthTo: 0,
    blankText: 'El grid de seleccionar esta vacio',
    noSelectionText: 'Hay profesores sin seleccionar actividad',
    alias: ['widget.gridselectfield', 'widget.gridselect'],
    hideNavIcons: false,
    buttons: ['add', 'remove', 'addAll', 'removeAll'],
    searchField: '',
    store: {},
    value: [],
    heigth: 230,
    buttonsText: {
        add: "Insertar Seleccionados",
        remove: "Eliminar Seleccionados",
        addAll: "Insertar Todos",
        removeAll: "Eliminar Todos"
    },
    layout: {type: 'hbox', align: 'stretch'},
    initComponent: function () {
        var me = this;
        me.store = Ext.getStore(me.store);
        me.storeFrom = Ext.create(me.classFrom, {autoLoad: false, model: 'Postgrado.model.MaestriaClaustroSelector'});
        me.pushElements(me.storeFrom, me.store);
        me.storeTo = Ext.create(me.classTo, {autoLoad: false});
        me.items = me.setupItems();
        me.callParent(arguments);
        me.initField();
        me.fireEvent('drop')
    },
    setupItems: function () {
        var me = this;
        me.fromField = me.createListFrom(me.fromTitle);
        me.toField = me.createListTo(me.toTitle);
        return [me.fromField, {
            xtype: 'container',
            margins: '0 4',
            layout: {type: 'vbox', pack: 'center'},
            items: me.createButtons()
        }, me.toField]
    },
    createListFrom: function (title) {
        var me = this;
        return Ext.create('Ext.grid.Panel', {
            width: me.widthFrom,
            submitValue: false,
            getSubmitData: function () {
                return null
            },
            getModelData: function () {
                return null
            },
            flex: 1,
            height: me.heigth,
            selType: 'checkboxmodel',
            dragGroup: me.ddGroup,
            dropGroup: me.ddGroup,
            tbar: [{
                xtype: 'textfield',
                enableKeyEvents: true,
                fieldLabel: 'Buscar',
                labelWidth: 60,
                submitValue: false,
                listeners: {
                    keyup: function (text) {
                        store = me.storeFrom;
                        value = text.getValue();
                        store.filter({
                            filterFn: function (reg) {
                                return Ext.String.startsWith(reg.get(me.searchField).nombreApellidos, value)
                            }
                        })
                    }
                }
            }],
            title: title,
            columns: [{
                header: 'Nombre y Apellidos', dataIndex: 'claustro', renderer: function (obj) {
                    return obj.nombreApellidos
                }, flex: 1
            }],
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    ddGroup: 'multiselector',
                    dropGroup: 'miselector',
                    dragGroup: 'miselector'
                }
            },
            store: me.storeFrom
        })
    },
    createListTo: function (title) {
        var me = this;
        return Ext.create('Ext.grid.Panel', {
            submitValue: false,
            width: me.widthTo,
            getSubmitData: function () {
                return null
            },
            getModelData: function () {
                return null
            },
            flex: 1.3,
            dragGroup: me.ddGroup,
            dropGroup: me.ddGroup,
            title: title,
            height: me.heigth,
            selType: 'checkboxmodel',
            columns: [{
                header: 'Nombre', dataIndex: 'claustro', renderer: function (obj) {
                    return obj.nombreApellidos
                }, flex: 1
            }, {
                header: 'Actividad',
                dataIndex: 'actividad',
                renderer: function (obj) {
                    return obj === undefined ? 'Seleccione...' : obj.actividad === undefined ? 'Seleccione...' : obj.actividad
                },
                flex: 0.6,
                editor: {
                    xtype: 'combo',
                    displayField: 'actividad',
                    name: 'actividad',
                    valueField: 'objeto',
                    queryMode: 'local',
                    displayTpl: new Ext.XTemplate('<tpl for="."><tpl if="actividad.actividad!=undefined">{actividad.actividad}<tpl else  >{actividad}</tpl></tpl>'),
                    store: Ext.create('Ext.data.Store', {
                        fields: ['idActividad', 'actividad', {
                            name: 'objeto',
                            persist: false
                        }],
                        data: [{
                            idActividad: 1,
                            actividad: 'Coordinador',
                            objeto: {idActividad: 1, actividad: 'Coordinador'}
                        }, {
                            idActividad: 2,
                            actividad: 'Miembro',
                            objeto: {idActividad: 2, actividad: 'Miembro'}
                        }, {
                            idActividad: 3,
                            actividad: 'Profesor',
                            objeto: {idActividad: 3, actividad: 'Profesor'}
                        }, {
                            idActividad: 4,
                            actividad: 'Tutor',
                            objeto: {idActividad: 4, actividad: 'Tutor'}
                        }, {
                            idActividad: 5,
                            actividad: 'Profesor y Tutor',
                            objeto: {idActividad: 5, actividad: 'Profesor y Tutor'}
                        }]
                    }),
                    listeners: {
                        select: function (combo) {
                            grid = me.toField;
                            var valor = combo.getValue();
                            valido = true;
                            store = grid.getStore();
                            store.each(function (reg) {
                                if (reg.get('actividad') !== undefined)if (valor.idActividad === 1 && reg.get('actividad').idActividad === valor.idActividad) {
                                    valido = false;
                                    return false
                                }
                            });
                            if (!valido) {
                                Ext.Msg.show({
                                    title: 'Informaci\u00f3n',
                                    icon: Ext.Msg.INFO,
                                    msg: 'Ya existe un coordinador para esta maestria',
                                    buttons: Ext.Msg.OK
                                });
                                combo.clearValue()
                            }
                        }
                    }
                }
            }],
            viewConfig: {
                plugins: [{
                    ptype: 'gridviewdragdrop',
                    ddGroup: 'multiselector',
                    dropGroup: 'miselector',
                    dragGroup: 'miselector'
                }]
            },
            plugins: [{
                ptype: 'rowediting',
                clicksToEdit: 1,
                saveBtnText: 'Guardar',
                cancelBtnText: 'Cancelar',
                errorSumary: false
            }],
            store: me.storeTo
        })
    },
    createButtons: function () {
        var me = this, buttons = [];
        if (!me.hideNavIcons) {
            Ext.Array.forEach(me.buttons, function (name) {
                buttons.push({
                    xtype: 'button',
                    tooltip: me.buttonsText[name],
                    handler: me['on' + Ext.String.capitalize(name) + 'BtnClick'],
                    cls: Ext.baseCSSPrefix + 'form-itemselector-btn',
                    iconCls: Ext.baseCSSPrefix + 'form-itemselector-' + name,
                    navBtn: true,
                    scope: me,
                    margin: '4 0 0 0'
                })
            })
        }
        return buttons
    },
    getValue: function () {
        var me = this, store = me.storeTo;
        me.value = new Array();
        store.each(function (reg) {
            me.value.push(reg.data)
        });
        return me.value
    },
    getSubmitValue: function () {
        return this.getValue()
    },
    getSubmitData: function () {
        var me = this, data = null, val;
        val = me.getSubmitValue();
        if (val !== null) {
            data = {};
            data[me.getName()] = val
        }
        return data
    },
    isValid: function () {
        var me = this;
        return this.validateValue(me.getValue())
    },
    onAddBtnClick: function () {
        var list = this.fromField, store = list.getStore(), selected = this.getSelections(list), stTo = this.storeTo;
        store.remove(selected);
        stTo.insert(0, selected);
        this.toField.getSelectionModel().select(selected)
    },
    onRemoveBtnClick: function () {
        var list = this.toField, store = list.getStore(), stFrom = this.storeFrom, selected = this.getSelections(list);
        stFrom.add(selected);
        store.remove(selected);
        if (selected.length !== 0) {
            stFrom.sort([{property: selected[0].fields.keys[0], direction: 'ASC'}])
        }
        list.getSelectionModel().select(selected)
    },
    onAddAllBtnClick: function () {
        var list = this.fromField, store = list.getStore(), storeTo = this.storeTo, selected = store.getRange();
        storeTo.add(selected);
        store.removeAll();
        list.getSelectionModel().select(selected)
    },
    onRemoveAllBtnClick: function () {
        var list = this.toField, store = list.getStore(), storeFrom = this.storeFrom, selected = store.getRange();
        storeFrom.add(selected);
        store.removeAll();
        if (selected.length !== 0) {
            storeFrom.sort([{property: selected[0].fields.keys[0], direction: 'ASC'}])
        }
        list.getSelectionModel().select(selected)
    },
    getSelections: function (list) {
        return list.getSelectionModel().getSelection()
    },
    pushElements: function (storeFrom, store) {
        store.each(function (reg) {
            storeFrom.add({claustro: reg.data})
        })
    },
    validateValue: function (value) {
        return value
    },
    markInvalid: function (errors) {
        var me = this, oldMsg = me.getActiveError();
        me.setActiveErrors(Ext.Array.from(errors));
        if (oldMsg !== me.getActiveError()) {
            me.updateLayout()
        }
    },
    clearInvalid: function () {
        var me = this, hadError = me.hasActiveError();
        me.unsetActiveError();
        if (hadError) {
            me.updateLayout()
        }
    },
    getErrors: function () {
        var me = this, errors = [], numSelected, store = me.storeTo;
        numSelected = me.value.length;
        if (!me.allowBlank && numSelected < 1) {
            errors.push(me.blankText)
        }
        valido = true;
        store.each(function (reg) {
            if (reg.get('actividad') === undefined) {
                valido = false;
                return false
            } else if (reg.get('actividad').idActividad === undefined) {
                valido = false;
                return false
            }
        });
        if (!valido) {
            errors.push(me.noSelectionText)
        }
        return errors
    },
    clearValue: function () {
        this.setValue([])
    }
});