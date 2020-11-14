function is_empty_string(str) {
    return str == null || str == ""
}

const JASS_PARAM_COUNT_LIMIT = 31

class JassFuncBuilder {
    constructor(options) {
        options = options || {}
        options.mode = options.mode || 'jass'

        this._prefix = ""
        this._name = ""
        this._params = []
        this._returnType = ""
        this._actions = []
        this._indentBase = 0
        this._indent = 2
        this._mode = options.mode
    }

    getIndentBase() {
        return ' '.repeat(this._indentBase)
    }
    getIndent() {
        return ' '.repeat(this._indent)
    }
    getParamCount() {
        return this._params.length
    }
    isMeetParamLimit() {
        return this.getParamCount() >= JASS_PARAM_COUNT_LIMIT
    }

    setPrefix(prefix) {
        this._prefix = prefix
    }
    setName(name) {
        this._name = name
    }
    addParam(type, name) {
        const param = {
            type: type,
            name: name
        }
        this._params.push(param)

        if (this._params.length > JASS_PARAM_COUNT_LIMIT) {
            console.warn('JassFuncBuilder: Meet JASS_PARAM_COUNT_LIMIT!!!', this)
        }
    }
    setReturnType(type) {
        this._returnType = type
    }
    addAction(text) {
        this._actions.push(text)
    }
    setIndentBase(indentBase) {
        this._indentBase = indentBase
    }
    setIndent(indent) {
        this._indent = indent
    }

    build() {
        let paramsTexts = []
        this._params.forEach((info) => {
            const text = `${info.type} ${info.name}`
            paramsTexts.push(text)
        })
        const paramsText = paramsTexts.join(', ')

        const actionsText = this._actions.map((text) => {
            return `${this.getIndentBase()}${this.getIndent()}${text}`
        }).join('\r\n')

        const arr = []
        let prefix = ""
        if (is_empty_string(this._prefix) == false) {
            prefix = `${this._prefix} `
        }
        if (this._mode == 'zinc') {
            if (is_empty_string(this._returnType) == false) {
                arr.push(`${this.getIndentBase()}${prefix}function ${this._name}(${paramsText}) -> ${this._returnType}`)
            } else {
                arr.push(`${this.getIndentBase()}${prefix}function ${this._name}(${paramsText})`)
            }
            arr.push(`{\r\n${actionsText}\r\n${this.getIndentBase()}}`)
        } else {
            if (is_empty_string(this._returnType) == false) {
                arr.push(`${this.getIndentBase()}${prefix}function ${this._name} takes ${paramsText} returns ${this._returnType}`)
            } else {
                arr.push(`${this.getIndentBase()}${prefix}function ${this._name} takes ${paramsText} returns nothing`)
            }
            arr.push(`\r\n${actionsText}\r\n${this.getIndentBase()}endfunction`)
        }

        return arr.join(' ')
    }
}

module.exports = JassFuncBuilder
