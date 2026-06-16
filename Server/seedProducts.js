const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');

const sampleProducts = [
  {
    name: 'iPhone 12',
    description: 'Apple iphone with 8GB ram and 128GB storage. Latest model with advanced features.',
    price: 79999,
    category: 'Mobiles',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&auto=format&fit=crop&q=60',
    rating: 4.5,
  },
  {
    name: 'Realme buds',
    description: 'TWS buds with 10.2mm drivers giving you premium sound quality.',
    price: 2999,
    category: 'Electronics',
    stock: 100,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=60',
    rating: 4.2,
  },
  {
    name: 'MRF cricket bat',
    description: 'Popular willow wood cricket bat from MRF. Suitable for your all format plays in all conditions.',
    price: 1698,
    category: 'Sports-Equipment',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&auto=format&fit=crop&q=60',
    rating: 4.7,
  },
  {
    name: 'Carrom board',
    description: 'Quality carrom board along with necessary equipment to make your free time more joyful.',
    price: 1919,
    category: 'Sports-Equipment',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?w=400&auto=format&fit=crop&q=60',
    rating: 4.3,
  },
  {
    name: 'Kokobura cricket bat',
    description: 'Imported cricket bat made with English willow wood. Premium bat to enhance your playing experience.',
    price: 2555,
    category: 'Sports-Equipment',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=400&auto=format&fit=crop&q=60',
    rating: 4.8,
  },
  {
    name: 'Samsung Smart TV',
    description: '55 inch 4K UHD Smart LED TV with built-in Alexa and streaming apps.',
    price: 45999,
    category: 'Electronics',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&auto=format&fit=crop&q=60',
    rating: 4.6,
  },
  {
    name: 'Sony Headphones',
    description: 'Wireless noise cancelling headphones with 30-hour battery life.',
    price: 8999,
    category: 'Electronics',
    stock: 75,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=60',
    rating: 4.5,
  },
  {
    name: 'Nike Running Shoes',
    description: 'Comfortable running shoes with air cushion technology for maximum comfort.',
    price: 4999,
    category: 'Fashion',
    stock: 60,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=60',
    rating: 4.4,
  },
  {
    name: 'Levi\'s Denim Jacket',
    description: 'Classic denim jacket with modern fit. Perfect for casual wear.',
    price: 3499,
    category: 'Fashion',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&auto=format&fit=crop&q=60',
    rating: 4.6,
  },
  {
    name: 'Organic Green Tea',
    description: 'Premium organic green tea leaves. Rich in antioxidants and healthy.',
    price: 299,
    category: 'Groceries',
    stock: 200,
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&auto=format&fit=crop&q=60',
    rating: 4.3,
  },
  {
    name: 'Basmati Rice 5kg',
    description: 'Premium quality aged basmati rice. Long grain and aromatic.',
    price: 799,
    category: 'Groceries',
    stock: 150,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=60',
    rating: 4.5,
  },
  {
    name: 'Samsung Galaxy S21',
    description: 'Latest Android smartphone with 5G capability and triple camera setup.',
    price: 69999,
    category: 'Mobiles',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&auto=format&fit=crop&q=60',
    rating: 4.6,
  },
  {
    name: 'OnePlus Nord',
    description: 'Mid-range smartphone with flagship features. Great value for money.',
    price: 29999,
    category: 'Mobiles',
    stock: 80,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop&q=60',
    rating: 4.4,
  },
  {
    name: 'Football - Adidas',
    description: 'Professional grade football with excellent grip and durability.',
    price: 1299,
    category: 'Sports-Equipment',
    stock: 55,
    image: 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=400&auto=format&fit=crop&q=60',
    rating: 4.5,
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('❌ MongoDB URI not found in environment variables');
      console.log('Please set MONGO_URI or MONGODB_URI in your .env file');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert sample products
    const inserted = await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${inserted.length} products`);

    console.log('\n📦 Sample Products Added:');
    inserted.forEach(product => {
      console.log(`   - ${product.name} (₹${product.price}) [${product.category}]`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
