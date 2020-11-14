const JassFuncBuilder = require('.')

function test_general() {
    const j = new JassFuncBuilder()
    j.setIndentBase(4)
    j.setIndent(4)
    j.setName('MyAwesomeRegisterFunction')
    j.setPrefix('public')
    j.setReturnType(null)
    for (let i = 1; i <= 31; i++) { j.addParam('integer', `p${i}`) }
    console.log(j.build())
}

function test_para() {
    let PARAM_COUNT = 99
    let PARAM_LIMIT = 31
    let PAGE = 0

    function calcPageCount() {
        return parseInt(Math.ceil(PARAM_COUNT / PARAM_LIMIT))
    }
    function getPageInfo() {
        let start = 1 + (PAGE - 1) * PARAM_LIMIT
        let end = 31 + (PAGE - 1) * PARAM_LIMIT
        return { start, end: Math.min(PARAM_COUNT, end) }
    }
    function nextPage() {
        PAGE += 1
        if (PAGE > calcPageCount()) {
            return false
        }
        return true
    }

    while (nextPage() == true) {
        const info = getPageInfo()
        const j = new JassFuncBuilder()
        j.setIndentBase(4)
        j.setIndent(4)
        j.setName(`MyAwesomeRegisterFunction${PAGE}`)
        j.setPrefix('public')
        j.setReturnType(null)
        for (let i = info.start; i <= info.end; i++) {
            j.addParam('integer', `p${i}`)
            j.addAction(`registerMyData("MyInt${i}", p${i});`)
        }
        console.log(j.build())
    }

}


console.log('>>> test: general')
test_general()
console.log('>>> test: para')
test_para()
