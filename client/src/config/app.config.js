module.exports = {
    baseURL: "http://localhost:3001",

    //#region chip Seq setting
    chipSeqBrowserType: [
        { label: 'UCSC', value: 'UCSC', template: 'UCSC, ID:$ID, color:$color' },
        { label: 'WashU', value: 'WashU', template: 'WashU, ID:$ID, color:$color' }
    ],

    chipSeqSelector: [
        { label: 'Factor', value: 'factoryID'},
        { label: 'Tissue', value: 'tissueID'},
        { label: 'CellLine', value: 'cellLineID'},
        { label: 'Sex', value: 'sexID'},
        { label: 'Condition', value: 'conditionID'}
    ],

    chipSeqColorDB: [
        '27:158:119',
        '217:95:2',
        '117:112:179',
        '231:41:138',
        '102:166:30',
        '230:171:2',
        '166:118:29',
        '102:102:102',
    ]
    //#endregion
}