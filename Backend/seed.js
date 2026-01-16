const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./src/models/product.model');
const User = require('./src/models/user.model');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.log('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const sampleProducts = [
  {
    name: 'Laptop',
    availableStock: 10,
  },
  {
    name: 'Mouse',
    availableStock: 25,
  },
  {
    name: 'Keyboard',
    availableStock: 15,
  },
  {
    name: 'Monitor',
    availableStock: 8,
  },
  {
    name: 'Headphones',
    availableStock: 20,
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');
    
    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@augmentic.com',
      password: 'admin123',
      role: 'admin',
      registrationType: 'self-registered',
      isActive: true,
    });
    console.log('✓ Admin user created');
    console.log(`  Email: admin@augmentic.com`);
    console.log(`  Password: admin123`);
    
    // Insert sample products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`✓ ${createdProducts.length} products added successfully`);
    
    createdProducts.forEach((product) => {
      console.log(`  - ${product.name} (Stock: ${product.availableStock})`);
    });
    
    console.log('\n✓ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
