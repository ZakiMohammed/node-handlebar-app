const express = require('express');
const hbs = require('express-handlebars');
const dataProducts = require('./data/products');

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
app.use('/bootswatch', express.static(__dirname + '/node_modules/bootswatch/dist'));
app.use('/assets', express.static(__dirname + '/views/assets'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));

// handlebars routes
app.get('/', (req, res) => {
    res.render('home', {
        title: 'HBS App',
        showBanner: true,
        products: dataProducts.sort((a, b) => b.rating - a.rating).slice(0, 3)
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

    let message = '';

    switch (req.query.message) {
        case 'success':
            message = 'Form submitted successfully';
            break;
        case 'incomplete':
            message = 'Please complete the form';
            break;
    }

    res.render('contact', {
        title: 'Contact',
        breadCrumbs: [
            { title: 'Home', link: '/', active: false },
            { title: 'Contact', link: '', active: true },
        ],
        message: message,
        showPageTop: true
    });
});
app.get('/products', (req, res) => {
    const search = req.query.search;
    let products = [];
    if (search) {
        products = dataProducts.filter(i => i.title.toLowerCase().includes(search.toLowerCase()));
    } else {
        products = dataProducts;
    }
    products = products.sort((a, b) => b.rating - a.rating);

    res.render('products', {
        title: 'Products',
        breadCrumbs: [
            { title: 'Home', link: '/', active: false },
            { title: 'Products', link: '', active: true },
        ],
        showPageTop: true,
        products: products,
        search: search
    });
});

// api routes
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/products', require('./routes/products'));

// entry point
app.listen(PORT, () => console.log(`Server started on ${PORT}`));