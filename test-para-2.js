const JassRegisterBuilder = require('./register-builder.js')

function test() {
    const builder = new JassRegisterBuilder()
    builder.setName('Register#FULLNAME#Data')
    for (N = 1; N <= 99; N++) {
        builder.addParam('integer', `p${N}`)
    }
    console.log(builder.build())
    console.log('page count: ' + builder.getPageCount())
}
function test2() {
    const builder = new JassRegisterBuilder({ mode: 'zinc' })
    builder.setName('Register#FULLNAME#Data')
    for (N = 1; N <= 99; N++) {
        builder.addParam('integer', `p${N}`)
    }
    console.log(builder.build())
    console.log('page count: ' + builder.getPageCount())
}

test()
