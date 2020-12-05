const router = require('express').Router()
const Query = require('../db')

router.get('/:mode', async (req, res) => {
    try {
        let q = `SELECT * FROM words WHERE mode = ?`;
        let result = await Query(q, [req.params.mode]);
        res.json(result);
    } catch (error) { console.log(error) };
});


module.exports = router;
