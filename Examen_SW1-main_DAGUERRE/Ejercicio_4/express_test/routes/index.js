var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var imgExpress = "/images/zojuy79lo3fn3qdt7g6p.webp";
	var imgSuu = "/images/Untitled.png";
	var textArray = ["Elemento1", "Elemento2"];

	res.render('index', { 
		title: 'Express',
  		textArray: textArray,
  		img: imgExpress,
  		img2: imgSuu
	});
});

module.exports = router;
