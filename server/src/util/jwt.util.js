import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const privateKey = fs.readFileSync(path.join(__dirname, '../../keys/private.key'), 'utf8');
const publicKey = fs.readFileSync(path.join(__dirname, '../../keys/public.key'), 'utf8');

export const generateAccessToken = ({
    userID, 
    email, 
    role
}) => {
    return jwt.sign(
        {
            userID,
            email,
            role,
            type: 'access'
        },
        privateKey,
        {
            algorithm: 'RS256',
            expiresIn: '25m',
            issuer: 'dinehub-service',
            audience: 'dinehub-client'
        }
    );
};

export const generateRefreshToken = (userID) => {
    return jwt.sign(
        {
            userID,
            type: 'refresh'
        },
        privateKey,
        {
            algorithm: 'RS256',
            expiresIn: '7d',
            issuer: 'dinehub-service',
            audience: 'dinehub-client'
        }
    );
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, publicKey, {
            algorithms: ['RS256'],
            issuer: 'dinehub-service',
            audience: 'dinehub-client'
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token has expired');
        } else if (error.name === 'JsonWebTokenError') {
            throw new Error('Invalid token');
        } else {
            throw new Error('Token verification failed');
        }
    }
};

export const decodeToken = (token) => {
    return jwt.decode(token);
};
