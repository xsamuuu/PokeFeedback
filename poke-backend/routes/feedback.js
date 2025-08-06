const express = require('express');
const router = express.Router();
const { getComments, addComment, reactToComment } = require('../controllers/feedbackcontroller');

router.get('/:pokemonId', getComments);
router.post('/:pokemonId', addComment);
router.post('/:pokemonId/react/:commentId', reactToComment);

module.exports = router;