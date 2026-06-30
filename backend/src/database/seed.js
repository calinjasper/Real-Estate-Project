require('dotenv').config();
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
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

const loadCSVData = () => {
  return new Promise((resolve, reject) => {
    const csvPath = path.join(__dirname, '../../data/properties.csv');
    const results = [];

    if (!fs.existsSync(csvPath)) {
      console.log('CSV file not found, using random data');
      resolve(null);
      return;
    }

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        console.log(`Loaded ${results.length} properties from CSV`);
        resolve(results);
      })
      .on('error', (err) => {
        console.error('Error loading CSV:', err);
        resolve(null);
      });
  });
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

    console.log('Loading properties...');
    const csvData = await loadCSVData();
    let properties = [];

    if (csvData) {
      // Use CSV data
      for (let i = 0; i < csvData.length; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const row = csvData[i];
        properties.push({
          title: row.title || generateRandomProperty(randomUser.id, i).title,
          description: row.description,
          price: parseFloat(row.price) || generateRandomProperty(randomUser.id, i).price,
          city: row.city || 'Mumbai',
          state: row.state,
          country: row.country || 'India',
          address: row.address,
          propertyType: row.propertyType || 'Apartment',
          bedrooms: parseInt(row.bedrooms) || 2,
          bathrooms: parseFloat(row.bathrooms) || 2,
          area: parseFloat(row.area),
          ownerId: randomUser.id,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)),
          updatedAt: new Date(),
        });
      }
    }

    // If no CSV data or to add more properties, generate random ones
    const TOTAL_PROPERTIES = Math.max(properties.length, 5000);
    if (properties.length < TOTAL_PROPERTIES) {
      console.log(`Generating additional ${TOTAL_PROPERTIES - properties.length} random properties...`);
      for (let i = properties.length; i < TOTAL_PROPERTIES; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        properties.push(generateRandomProperty(randomUser.id, i));
      }
    }

    console.log('Creating properties in database...');
    const BATCH_SIZE = 500;
    for (let i = 0; i < properties.length; i += BATCH_SIZE) {
      const batch = properties.slice(i, i + BATCH_SIZE);
      await prisma.property.createMany({ data: batch });

      if (i % 1000 === 0) {
        console.log(`Created ${i} properties...`);
      }
    }

    console.log('Database seeded successfully!');
    console.log(`- ${users.length} users created`);
    console.log(`- ${properties.length} properties created`);
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
