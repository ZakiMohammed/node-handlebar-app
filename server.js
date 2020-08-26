const express = require('express');
const hbs = require('express-handlebars');

const app = express();

const PORT = process.env.PORT || 4000;

// json parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// handlebars
app.engine('hbs', hbs({
    extname: '.hbs',
    helpers: {
        iif: function (value, valueToCheck, result) {
            return value === valueToCheck ? result : '';
        },
        iifUnsafe: function (value, valueToCheck, result) {
            return value == valueToCheck ? result : '';
        },
        stringify: function (object) {
            return JSON.stringify(object);
        }
    }
}));
app.set('view engine', 'hbs');

// static imports
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/assets', express.static(__dirname + '/views/assets'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));

// handlebars routes
app.get('/', (req, res) => {
    res.render('home', {
        title: 'HBS App',
        showBanner: true
    });
});
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        breadCrumbs: [
            { title: 'Home', link: '/', active: false },
            { title: 'About', link: '', active: true },
        ],
        showPageTop: true
    });
});
app.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'Contact',
        breadCrumbs: [
            { title: 'Home', link: '/', active: false },
            { title: 'Contact', link: '', active: true },
        ],
        message: req.query.message || '',
        showPageTop: true
    });
});

// entry point
app.listen(PORT, () => console.log(`Server started on ${PORT}`));