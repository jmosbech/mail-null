
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { mails: global.mails });
};