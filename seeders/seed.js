// Import Sequelize and models
const { Sequelize } = require('sequelize');
// const bcrypt = require('bcrypt');
const { User } = require('../models');

// Load environment variables
require('dotenv').config();

// Setup Sequelize using the DATABASE_URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres', // specify the dialect
});

async function seedUser() {
    try {
        // Connect to the database
        await sequelize.authenticate();
        console.log('Database connected successfully');

        // Hash the password
        // const hashedPassword = await bcrypt.hash('password123', 10);

        // Insert user into the database
        const user = await User.create({
            username: 'shubhabnk_doe',
            email: 'shubahnk@example.com',
            password: "hashedPassword", // Store the hashed password
        });

        console.log('User registered successfully:', user);
    } catch (error) {
        console.error('Error seeding user:', error);
    } finally {
        // Close the database connection
        await sequelize.close();
    }
}

// Run the seeding function
seedUser();