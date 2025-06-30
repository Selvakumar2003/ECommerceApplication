const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');
const { Bank } = require('../models');

const seedBanks = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    // Clear existing bank accounts
    await Bank.destroy({ where: {} });

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    
    const bankAccounts = [
      {
        accountNumber: '1234567890123456',
        accountHolderName: 'Selvakumar',
        upiId: 'selva@paytm',
        balance: 150000.00,
        password: await bcrypt.hash('1234', salt),
        bankName: 'State Bank of India',
        ifscCode: 'SBIN0001234'
      },
      {
        accountNumber: '2345678901234567',
        accountHolderName: 'Priya',
        upiId: 'priya@googlepay',
        balance: 75000.00,
        password: await bcrypt.hash('5678', salt),
        bankName: 'HDFC Bank',
        ifscCode: 'HDFC0002345'
      },
      {
        accountNumber: '3456789012345678',
        accountHolderName: 'Baala',
        upiId: 'Baala@phonepe',
        balance: 200000.00,
        password: await bcrypt.hash('9876', salt),
        bankName: 'ICICI Bank',
        ifscCode: 'ICIC0003456'
      },
      {
        accountNumber: '4567890123456789',
        accountHolderName: 'Sneha',
        upiId: 'sneha@paytm',
        balance: 95000.00,
        password: await bcrypt.hash('4321', salt),
        bankName: 'Axis Bank',
        ifscCode: 'UTIB0004567'
      },
      {
        accountNumber: '5678901234567890',
        accountHolderName: 'Vikram',
        upiId: 'vikram@googlepay',
        balance: 300000.00,
        password: await bcrypt.hash('1357', salt),
        bankName: 'Punjab National Bank',
        ifscCode: 'PUNB0005678'
      }
    ];

    await Bank.bulkCreate(bankAccounts);
    
    console.log('Bank accounts seeded successfully!');
    console.log('\n=== TEST BANK ACCOUNTS ===');
    console.log('Card Payment Test:');
    console.log('Account: 1234567890123456 | PIN: 1234 | Balance: ₹1,50,000');
    console.log('Account: 2345678901234567 | PIN: 5678 | Balance: ₹75,000');
    console.log('\nUPI Payment Test:');
    console.log('UPI: selva@paytm | PIN: 1234 | Balance: ₹1,50,000');
    console.log('UPI: priya@googlepay | PIN: 5678 | Balance: ₹75,000');
    console.log('\nAll accounts have sufficient balance for testing!');
    
  } catch (error) {
    console.error('Error seeding bank accounts:', error);
  }
};

if (require.main === module) {
  seedBanks().then(() => process.exit(0));
}

module.exports = seedBanks;