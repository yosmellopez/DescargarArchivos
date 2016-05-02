Ext.define('Postgrado.model.PlanPostgrado', {
    extend: 'Postgrado.model.Base',
    fields: ['idPlanPostgrado', 'fechaInicio', 'fechaFin', 'creditos', 'matriculaInicial', 'tipo', 'facultad', 'organismos', {
        name: 'insertado',
        defaultValue: false
    }],
    idProperty: 'idPlanPostgrado',
    identifier: 'custom',
    belongsTo: [{model: 'Facultad', associationKey: 'facultad', name: 'Facultad'}, {
        model: 'Tipo',
        associationKey: 'tipo',
        name: 'Tipo'
    }]
});