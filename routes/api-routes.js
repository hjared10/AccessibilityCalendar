const db = require("../models")
const router = require("express").Router()

// ROUTES //

// CREATE
router.post("/events", (req, res) => {
	if (!req.body.event_pid) req.body.event_pid = 0
	if (!req.body.event_length) req.body.event_length = 0
	db.Storage.create(req.body).then(results => {
		// console.log(results)
		res.json(results)
	})
})

// READ
router.get("/events", (req, res) => {
	db.Storage.findAll().then(results => {
		res.json(results)
	})
})

// UPDATE (not working)
router.put("/events", (req, res) => {
	db.Storage.update(req.body,
		{
			where: {
				event_pid: req.body.event_pid
			}
		})
	.then(results => {
			res.json(results)
		})
})

// DELETE (not working)
router.delete("/events", (req, res) => {
	db.Storage.destroy(req.body,
		{
			where: {
				event_pid: req.body.event_pid
			}
		})
	.then(results => {
			res.json(results)
		})
})

module.exports = router