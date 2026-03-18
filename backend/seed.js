const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Warehouse = require('./models/Warehouse');

dotenv.config({ override: true });

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding');

        // Seed warehouses
        await Warehouse.deleteMany({});
        const warehouses = await Warehouse.insertMany([
            { warehouseName: 'Delhi Central Warehouse', location: { city: 'Delhi', lat: 28.6139, lng: 77.2090 } },
            { warehouseName: 'Mumbai West Warehouse', location: { city: 'Mumbai', lat: 19.0760, lng: 72.8777 } },
            { warehouseName: 'Bangalore South Warehouse', location: { city: 'Bangalore', lat: 12.9716, lng: 77.5946 } },
            { warehouseName: 'Chennai East Warehouse', location: { city: 'Chennai', lat: 13.0827, lng: 80.2707 } }
        ]);
        console.log('Warehouses seeded:', warehouses.length);

        // Seed demo users (skip if exist)
        // Seed demo users (skip if exist or update password)
        const demoUsers = [
            { name: 'Demo Customer', email: 'customer@gmail.com', password: 'customer@98765', role: 'customer' },
            { name: 'Demo Seller', email: 'seller@gmail.com', password: 'seller@98765', role: 'seller' },
            { name: 'Demo Admin', email: 'admin@gmail.com', password: 'admin@98765', role: 'admin' }
        ];
        for (const u of demoUsers) {
            const existingUser = await User.findOne({ email: u.email });
            if (!existingUser) {
                await User.create(u);
            } else {
                existingUser.password = u.password;
                await existingUser.save();
            }
        }
        console.log('Demo users seeded');

        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};

seedData();
