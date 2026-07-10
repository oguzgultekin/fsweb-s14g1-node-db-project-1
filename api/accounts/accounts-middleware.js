const Accounts = require('./accounts-model');

exports.checkAccountPayload = (req, res, next) => {
    let { name, budget } = req.body;

    if (name === undefined || budget === undefined) {
        return res.status(400).json({
            message: 'name and budget are required',
        });
    }

    name = String(name).trim();

    if (name.length < 3 || name.length > 100) {
        return res.status(400).json({
            message: 'name of account must be between 3 and 100',
        });
    }

    if (
        budget === '' ||
        budget === null ||
        budget === undefined ||
        !Number.isFinite(Number(budget))
    ) {
        return res.status(400).json({
            message: 'budget of account must be a number',
        });
    }

    budget = Number(budget);

    if (budget < 0 || budget > 1000000) {
        return res.status(400).json({
            message: 'budget of account is too large or too small',
        });
    }

    req.body.name = name;
    req.body.budget = budget;

    next();
};

exports.checkAccountNameUnique = async (req, res, next) => {
    try {
        const name = req.body.name.trim();

        const accounts = await Accounts.getAll();

        const existing = accounts.find(
            a => a.name === name && a.id !== Number(req.params.id)
        );

        if (existing) {
            return res.status(400).json({
                message: 'that name is taken',
            });
        }

        next();
    } catch (err) {
        next(err);
    }
};

exports.checkAccountId = async (req, res, next) => {
    try {
        const account = await Accounts.getById(req.params.id);

        if (!account) {
            return res.status(404).json({
                message: 'account not found',
            });
        }

        req.account = account;
        next();
    } catch (err) {
        next(err);
    }
};