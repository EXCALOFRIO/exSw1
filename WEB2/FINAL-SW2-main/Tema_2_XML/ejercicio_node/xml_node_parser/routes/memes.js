const { parseStringPromise } = require('xml2js');
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
    // Parse xml
    let memes = null;
    try {
        memes = await parseStringPromise(req.memes);

        // Clean content to get only image
        memes.feed.entry.forEach(entry => {
            entry.content[0]._ = entry.content[0]._.match(/<img (?:(?:src=".*")?|(?:alt=".*")?|(?:title=".*")?){1,3} \/>[ ]?/);
        });
    } catch(error) {
        console.error(error);
    }

    res.render('memes', { title: 'r/memes', memes });
});

module.exports = router;