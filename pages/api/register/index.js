import UserModel from '../../../models/user';
import { authenticateToken } from '../middleware/auth';
import { DataTypes } from 'sequelize';
import db from '../../../models/index';
const sequelize = db.sequelize;


const User = UserModel(sequelize, DataTypes);

export default async function register(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    const { username, email, password } = req.body;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already in use' });
        }
        const newUser = await User.create({
            username,
            email,
            password
        });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
    
}