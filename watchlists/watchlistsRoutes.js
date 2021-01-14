const { Router } = require('express');
const authMiddleware = require('../auth/authMiddleware');
const watchlistsControllers = require('./watchlistsControllers');

const router = Router();

router.post('/create', authMiddleware.requireAuth, authMiddleware.checkUser, watchlistsControllers.watchlists_create_post);
router.post('/remove', authMiddleware.requireAuth, authMiddleware.checkUser, watchlistsControllers.watchlists_remove_post);
router.get('/:wid', authMiddleware.requireAuth, watchlistsControllers.watchlists_detail);

router.post('/:wid/entries/create', authMiddleware.requireAuth, watchlistsControllers.watchlists_entries_create_post);
router.post('/:wid/entries/remove', authMiddleware.requireAuth, watchlistsControllers.watchlists_entries_remove_post);

module.exports = router;