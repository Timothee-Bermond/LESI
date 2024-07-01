const jwt = require('jsonwebtoken')
const User = require('../models/user')

const authentification = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, 'authTokens.authToken': token });

        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }

        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        console.error('Erreur d\'authentification:', e);
        res.status(401).send({ error: 'Merci de vous authentifier.' });
    }
};

function authorizeAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.sendStatus(403); // Accès interdit
    }
    next();
}

module.exports = { authentification, authorizeAdmin }