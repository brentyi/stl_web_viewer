const express = require('express');
const handlebars  = require('express-handlebars');

var app = express();
app.set('port', process.env.port || 5001);
app.use(express.static('assets'));

var hbs = handlebars.create({extname: '.hbs', defaultLayout: 'main'});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use('/', require('./routes/uploader'));
app.use('/viewer', require('./routes/viewer'));

app.get('/error', (request, response) => {
    response.render("error");
});

app.listen(app.get('port'), () => {
    console.log('Listening on port ', app.get('port'))
});
