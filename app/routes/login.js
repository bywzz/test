
/*
 * GET users listing.
 */

exports.login = function(req, res){
    res.render('login', { title: 'loginExpress' });
};