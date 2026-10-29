exports.getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.json({ user: null });
        }
        const userObj = req.user.toObject();
        delete userObj.password;
        return res.json(userObj);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to retrieve user' });
    }
};