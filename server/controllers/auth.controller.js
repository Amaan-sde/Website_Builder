const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');

const verifyFirebaseToken = async (idToken) => {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    if (!projectId) {
        throw new Error('FIREBASE_PROJECT_ID not configured');
    }

    const response = await fetch(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=${process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_WEB_API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
            signal: AbortSignal.timeout(5000)
        }
    );

    if (!response.ok) {
        throw new Error('Firebase token verification failed');
    }

    const data = await response.json();
    if (!data.users || data.users.length === 0) {
        throw new Error('Firebase token invalid — no user found');
    }

    return data.users[0];
};

const issueJwt = (userId, res) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    return token;
};

exports.googleAuth = async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ message: 'Firebase ID token is required' });
        }

        let firebaseUser;
        try {
            firebaseUser = await verifyFirebaseToken(idToken);
        } catch (verifyErr) {
            return res.status(401).json({ message: 'Identity verification failed. Please sign in again.' });
        }

        const email = firebaseUser.email;
        const name = firebaseUser.displayName || email.split('@')[0];
        const avatar = firebaseUser.photoUrl || '';
        const firebaseUid = firebaseUser.localId;

        if (!email) {
            return res.status(400).json({ message: 'Google account must have a verified email' });
        }

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                userName: name,
                email,
                avatar,
                firebaseUid
            });
        } else {
            if (!user.firebaseUid) {
                user.firebaseUid = firebaseUid;
                user.avatar = avatar || user.avatar;
                await user.save();
            }
        }

        const token = issueJwt(user._id, res);

        const userObj = user.toObject();
        delete userObj.password;

        return res.status(200).json({ user: userObj, token, message: 'Authenticated successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Authentication error. Please try again.' });
    }
};

exports.logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Logout error' });
    }
};

exports.demoAuth = async (req, res) => {
    try {
        let user = await User.findOne({ email: 'amaankhan172595@gmail.com' });
        if (!user) {
            user = await User.create({
                userName: 'Amaan Khan',
                email: 'amaankhan172595@gmail.com',
                plan: 'pro',
                credits: 500
            });
        }
        const token = issueJwt(user._id, res);
        const userObj = user.toObject();
        delete userObj.password;
        return res.status(200).json({ user: userObj, token, message: 'Signed in as Demo User' });
    } catch (err) {
        return res.status(500).json({ message: 'Demo authentication error' });
    }
};