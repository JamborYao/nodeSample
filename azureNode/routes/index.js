
/*
 * GET home page.
 */

exports.index = function (req, res) {
    res.render('index', {
        title: 'Nodejs test', 
        year: new Date().getFullYear(),
        content: 'hello world!'
    });
};

exports.about = function (req, res) {
    res.render('about', { title: 'About', year: new Date().getFullYear(), message: 'Your application description page' });
};

exports.contact = function (req, res) {
    res.render('contact', { title: 'Contact', year: new Date().getFullYear(), message: 'Your contact page' });
};
