const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');
const { User } = require('../models');

const seedUsers = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    // Check if users already exist
    const existingUsers = await User.count();
    if (existingUsers > 0) {
      console.log('Users already exist, skipping seeding');
      return;
    }

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    
    const users = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password123', salt)
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: await bcrypt.hash('password123', salt)
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', salt)
      }
    ];

    await User.bulkCreate(users);
    console.log('Users seeded successfully!');
    console.log('Test accounts:');
    console.log('- john@example.com / password123');
    console.log('- jane@example.com / password123');
    console.log('- admin@example.com / admin123');
    
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

if (require.main === module) {
  seedUsers().then(() => process.exit(0));
}

module.exports = seedUsers;