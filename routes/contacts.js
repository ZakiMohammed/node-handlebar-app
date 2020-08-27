const express = require('express')

const router = express.Router();

router.post('/', (req, res) => {
    const contact = req.body;
    if (!contact.name || !contact.email || !contact.message) {
        res.redirect('/contact?message=incomplete');
    }
    res.redirect('/contact?message=success');
});

module.exports = router;
