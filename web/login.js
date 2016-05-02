Ext.onReady(function () {
    var formulario = Ext.widget('form', {
        title: "Iniciar Sesión",
        bodyPadding: '5 5 3',
        width: 425,
        renderTo: 'contenido',
        iconCls: 'fa fa-lock',
        style: {
            margin: '100px auto',
            position: 'relative'
        },
        items: [{
                xtype: "panel",
                autoComplete: true,
                bodyPadding: "20 20",
                cls: "auth-dialog-login",
                header: false,
                width: 415,
                layout: {
                    type: "vbox", align: "stretch"
                },
                defaults: {margin: "5 0"},
                items: [{
                        xtype: "label",
                        text: "Inicie sesi\u00f3n con su cuenta del dominio",
                        cls: 'negrita'
                    }, {
                        xtype: "textfield",
                        cls: "auth-textbox",
                        name: 'usuario',
                        height: 55,
                        allowBlank: false,
                        emptyText: "Nombre de Usuario",
                        blankText: 'Este campo es requerido',
                        triggers: {
                            glyphed: {cls: "fa fa-user fa-3x subir-05x derecha"}
                        },
                        value: nombreUsuario,
                        listeners: {
                            specialkey: function (field, event) {
                                if (event.getKey() === event.ENTER) {
                                    this.up('form').login();
                                }
                            }
                        }
                    }, {
                        xtype: "textfield",
                        cls: "auth-textbox",
                        height: 55,
                        emptyText: "Contraseña",
                        inputType: "password",
                        name: "password",
                        blankText: 'Este campo es requerido',
                        allowBlank: false,
                        triggers: {
                            glyphed: {cls: "fa fa-lock fa-3x subir-05x derecha"}
                        },
                        listeners: {
                            specialkey: function (field, event) {
                                if (event.getKey() === event.ENTER) {
                                    this.up('form').login();
                                }
                            }
                        }
                    }, {
                        xtype: 'checkbox',
                        name: 'recordarme',
                        boxLabel: 'Recordarme',
                        labelAlign: 'right'
                    }, {
                        xtype: 'label',
                        id: 'mensaje',
                        flex: 1,
                        align: 'left',
                        html: '<span style="color:red;font-weight:bold;font-size:13px;height:20px;">' + error + '</span>',
                        style: {
                            color: 'red'
                        }
                    }, {
                        xtype: "button",
                        scale: "large",
                        ui: "soft-green",
                        iconAlign: "right",
                        iconCls: "x-fa fa-angle-right fa-2x",
                        text: "Iniciar Sesi\u00f3n",
                        formBind: true,
                        handler: function () {
                            this.up('form').login();
                        }
                    }]
            }],
        login: function () {
            formu = formulario.getForm();
            formulario.queryById('mensaje').setText('');
            formulario.setLoading('<span style="font-size:13px;">Iniciando sesi\u00f3n...</span>');
            if (formu.isValid()) {
                loginForm = Ext.create('Ext.form.Panel');
                bLoginForm = loginForm.getForm();
                valores = formu.getValues();
//                valores.password = hex_sha512(valores.password);
                bLoginForm.submit({
                    url: 'login_check',
                    standardSubmit: true,
                    clientValidation: true,
                    params: valores
                });
            } else {
                Ext.Msg.show({
                    msg: 'El formulario contiene errores. Verifique los campo se\u00f1alados',
                    title: 'Error',
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
                formulario.setLoading(false);
            }
        }
    });
});

