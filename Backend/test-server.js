// Quick test to verify all modules load correctly
console.log('Testing module imports...\n');

try {
  console.log('1. Loading product controller...');
  const productController = require('./src/controllers/product.controller');
  console.log('   ✓ Product controller loaded');
  console.log('   Exports:', Object.keys(productController).join(', '));

  console.log('\n2. Loading order controller...');
  const orderController = require('./src/controllers/order.controller');
  console.log('   ✓ Order controller loaded');
  console.log('   Exports:', Object.keys(orderController).join(', '));

  console.log('\n3. Loading product routes...');
  const productRoutes = require('./src/routes/product.routes');
  console.log('   ✓ Product routes loaded');

  console.log('\n4. Loading order routes...');
  const orderRoutes = require('./src/routes/order.routes');
  console.log('   ✓ Order routes loaded');

  console.log('\n5. Loading app...');
  const app = require('./src/app');
  console.log('   ✓ App loaded');

  console.log('\n✅ All modules loaded successfully!\n');
  console.log('You can now run: npm run dev');
  
} catch (error) {
  console.error('\n❌ Error loading modules:');
  console.error(error.message);
  console.error('\nStack trace:');
  console.error(error.stack);
  process.exit(1);
}
