const { Router } = require('express');
const authMiddleware = require('../auth/authMiddleware');
const assetsController = require('./assetsControllers');

const router = Router();

// stock assets
router.get('/stocks/:aid', authMiddleware.requireAuth, assetsController.assets_stocks_detail);
router.get('/stocks/:aid/recalculate', authMiddleware.requireAuth, assetsController.assets_stocks_recalculate);

// stock transactions
router.post('/stocks/:aid/create', authMiddleware.requireAuth, assetsController.transactions_stocks_create_post);
router.post('/stocks/:aid/remove', authMiddleware.requireAuth, assetsController.transactions_stocks_remove_post);

// crypto

// cash

module.exports = router;