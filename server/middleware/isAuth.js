import jwt from "jsonwebtoken"


const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({
                message: "Token Not Found!"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    }
    catch (err) {
        return res.status(500).json({
            message: "Invalid Token"
        })
    }
}


export default isAuth