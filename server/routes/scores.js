const router = require('express').Router()
const Query = require('../db')

router.post('/', async (req, res) => {
    const { score, user1, user2 } = req.body
    let q = `INSERT INTO games (score,user1,user2) VALUES (?,?,?)`
    await Query(q, [score, user1, user2])
    res.sendStatus(201)
});
router.get('/', async (req, res) => {
    try {
        let q = `SELECT * FROM games ORDER BY score DESC LIMIT 3`
        let result = await Query(q)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
});



module.exports = router;
