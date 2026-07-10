const router = require('express').Router();

const Accounts = require('./accounts-model');
const {
    checkAccountPayload,
    checkAccountNameUnique,
    checkAccountId,
} = require('./accounts-middleware');

router.get('/', async (req, res, next) => {
    try {
        const accounts = await Accounts.getAll();
        res.status(200).json(accounts);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', checkAccountId, async (req, res, next) => {
    try {
        res.status(200).json(req.account);
    } catch (err) {
        next(err);
    }
});

router.post(
    '/',
    checkAccountPayload,
    checkAccountNameUnique,
    async (req, res, next) => {
        try {
            const account = await Accounts.create(req.body);
            res.status(201).json(account);
        } catch (err) {
            next(err);
        }
    }
);

router.put(
    '/:id',
    checkAccountId,
    checkAccountPayload,
    checkAccountNameUnique,
    async (req, res, next) => {
        try {
            const account = await Accounts.updateById(req.params.id, req.body);
            res.status(200).json(account);
        } catch (err) {
            next(err);
        }
    }
);

router.delete('/:id', checkAccountId, async (req, res, next) => {
    try {
        const account = await Accounts.deleteById(req.params.id);
        res.status(200).json(account);
    } catch (err) {
        next(err);
    }
});

router.use((err, req, res, next) => { // eslint-disable-line
    res.status(err.status || 500).json({
        message: err.message || 'internal server error',
    });
});

module.exports = router;