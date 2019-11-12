const express = require('express')
const app = express()

app.use('/', express.static('public'))
app.set('port', 8000)

app.listen(app.get('port'), function () {
    console.log('Example app listening on port ' + app.get('port'))
})
