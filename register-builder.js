const JassFuncBuilder = require('./func-builder')

class JassRegisterBuilder {
    constructor(options) {
        options = options || {}
        options.mode = options.mode || 'jass'

        this._name = ""
        this._pageCount = 0
        this._builder = null
        this._builders = []
        this._mode = options.mode
    }
    newPage() {
        this._pageCount += 1
        this._builder = this.newBuilder()
        this._builder.setName(`${this._name}${this._pageCount - 1}`)
        if (this._mode == 'zinc') {
            this._builder.setPrefix('public')
        }
        if (this._pageCount == 1) {
            this.setupFirstPage()
        } else {
            this.setupOtherPage()
        }
        this._builders.push(this._builder)
    }
    getPageCount() {
        return this._pageCount
    }
    setupFirstPage() {
        this._builder.addParam('integer', 'id')
        this._builder.addParam('integer', 'gid')
        if (this._mode == 'zinc') {
            this._builder.addAction(`g_register_work_id = id;`)
            this._builder.addAction(`YDUserDataSet(integer, id, "#CODELABEL#.gid", integer, gid);`)
            this._builder.addAction(`YDUserDataSet(integer, gid, "#CODELABEL#.id", integer, id);`)
        } else {
            this._builder.addAction(`set g_register_work_id = id`)
            this._builder.addAction(`call YDUserDataSet(integer, id, "#CODELABEL#.gid", integer, gid)`)
            this._builder.addAction(`call YDUserDataSet(integer, gid, "#CODELABEL#.id", integer, id)`)
        }
    }
    setupOtherPage() {
        if (this._mode == 'zinc') {
            this._builder.addAction(`integer id = g_register_work_id;`)
        } else {
            this._builder.addAction(`local integer id = g_register_work_id`)
        }
    }
    setName(name) {
        this._name = name
    }
    addParam(type, name, key) {
        if (this.requireNewPage() == true) {
            this.newPage()
        }

        if (key == null) { key = name }

        this._builder.addParam(type, name)
        if (this._mode == 'zinc') {
            this._builder.addAction(`YDUserDataSet(integer, id, "#CODELABEL#.${key}", ${type}, ${name});`)
        } else {
            this._builder.addAction(`call YDUserDataSet(integer, id, "#CODELABEL#.${key}", ${type}, ${name})`)
        }
    }
    newBuilder() {
        return new JassFuncBuilder({ mode: this._mode })
    }
    requireNewPage() {
        return this._builder == null || this._builder.isMeetParamLimit() == true
    }
    build() {
        const funcs = []
        this._builders.forEach((builder) => {
            funcs.push(builder.build())
        })
        return funcs.join('\r\n')
    }
}

module.exports = JassRegisterBuilder
