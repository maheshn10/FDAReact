// https://www.npmjs.com/package/json-server
var jsonServer = require('json-server');
var server = jsonServer.create();
var path = require('path');
var router = jsonServer.router(path.join(__dirname, 'mockdb/api/db.json'));
// var router = jsonServer.router('../../api/db.json');
var middlewares = jsonServer.defaults();
var db = router.db; // lowdb instance

// Set default middlewares (logger, static, cors and no-cache) 
server.use(middlewares);

// Add custom routes before JSON Server router 
// To handle POST, PUT and PATCH you need to use a body-parser 
// You can use the one used by JSON Server 
server.use(jsonServer.bodyParser);
server.use(function (req, res, next) {
  // Continue to JSON Server router 
  next();
});

server.post('/about', function (req, res) {
  var about = db.get('about').value();
  var body = {};
  body.Data = {};
  body.Data.Value = about;
  body.ErrorCode = 0;
  body.Message = null;
  res.jsonp(body);
});

server.post('/studyview', function (req, res) {
  var studyView = db.get('studyView').value();
  console.log(studyView);
  var Value = [];
  var body = {};
  body.Data = {};
  body.Data.Value = studyView;
  body.ErrorCode = 0;
  body.Message = null;
  res.jsonp(body);
});

// Use default router 
server.use(router);
server.listen(3000, function () {
  console.log('JSON Server is running');
});
