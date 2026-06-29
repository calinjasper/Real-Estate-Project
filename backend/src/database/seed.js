require('dotenv').config();
const bcrypt = require('bcrypt');
const prisma = require('../config/prismaClient');

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat',
  'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
  'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad'
];

const propertyTypes = ['Apartment', 'Villa', 'House', 'Studio', 'Penthouse'];

const descriptions = [
  'Beautiful property with modern amenities and great location',
  'Spacious home with stunning views and premium finishes',
  'Cozy apartment in a prime neighborhood with easy access to everything',
  'Luxurious villa with private garden and swimming pool',
  'Perfect family home in a peaceful locality'
];

const generateRandomProperty = (ownerId, index) => {
  const city = cities[Math.floor(Math.random() * cities.length)];
  const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
  const price = Math.floor(Math.random() * 9000000) + 1000000;
  const bedrooms = Math.floor(Math.random() * 5) + 1;
  const bathrooms = Math.floor(Math.random() * 3) + 1 + (Math.random() > 0.5 ? 0.5 : 0);
  const area = Math.floor(Math.random() * 1800) + 500;

  return {
    title: `${propertyType} for Sale in ${city} - ${index + 1}`,
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    price,
    city,
    state: `${city} State`,
    country: 'India',
    address: `${Math.floor(Math.random() * 1000)} Main Street, ${city}`,
    propertyType,
    bedrooms,
    bathrooms,
    area,
    ownerId,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)),
    updatedAt: new Date(),
  };
};

const seed = async () => {
  try {
    console.log('Starting database seeding...');

    await prisma.inquiry.deleteMany();
    await prisma.propertyImage.deleteMany();
    await prisma.property.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();

    console.log('Creating test users...');
    const users = [];
    for (let i = 0; i < 50; i++) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await prisma.user.create({
        data: {
          name: `Test User ${i + 1}`,
          email: `user${i + 1}@example.com`,
          password: hashedPassword,
          phone: `+91${String(Math.floor(Math.random() * 9000000000) + 1000000000)}`,
        },
      });
      users.push(user);
    }

    console.log('Creating 50,000+ properties...');
    const BATCH_SIZE = 500;
    const TOTAL_PROPERTIES = 50000;

    for (let i = 0; i < TOTAL_PROPERTIES; i += BATCH_SIZE) {
      const properties = [];
      const end = Math.min(i + BATCH_SIZE, TOTAL_PROPERTIES);

      for (let j = i; j < end; j++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        properties.push(generateRandomProperty(randomUser.id, j));
      }

      await prisma.property.createMany({ data: properties });

      if (i % 5000 === 0) {
        console.log(`Created ${i} properties...`);
      }
    }

    console.log('Database seeded successfully!');
    console.log(`- ${users.length} users created`);
    console.log(`- ${TOTAL_PROPERTIES} properties created`);
    console.log('\nTest credentials:');
    console.log('Email: user1@example.com');
    console.log('Password: password123');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

seed();
