import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

export const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const decoded = jwt.verify(token, SECRET);
        req.user = decoded; // Attach decoded user info to request object
        next();
    } 
    catch (error) {
        return res.status(401).json({ message: 'Auth middleware error: ' + error.message });
    }
};