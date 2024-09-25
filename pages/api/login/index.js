import UserModel from '../../../models/user';

const bcrypt = require('bcrypt');
const { DataTypes } = require('sequelize');
const db = require('../../../models/index');
const jwt = require('jsonwebtoken');


const sequelize = db.sequelize;
const User = UserModel(sequelize, DataTypes);

const JWT_SECRET = process.env.JWT_SECRET;

export default async function login(req, res) {




    const { email, password } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email,
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Optionally, return the token and user data
        res.status(200).json({
            message: 'Login successful',
            token, // Send the JWT token
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
