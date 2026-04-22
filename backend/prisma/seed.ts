import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';


dotenv.config();

const prisma = new PrismaClient();


async function main() {
  console.log('🏁 Starting Seeding (Monochrome Tech Edition - Verified Images)...');

  
  const hashedPassword = await bcrypt.hash('password123', 10);
  const organizer = await prisma.user.upsert({
    where: { email: 'organizer@eventhub.com' },
    update: {},
    create: {
      email: 'organizer@eventhub.com',
      name: 'Nandan Achar',
      password: hashedPassword,
      role: 'ORGANIZER',
    },
  });

  
  const imageIds = [
    '1518770660439-4636190af475', 
    '1550751827-4bd374c3f58b', 
    '1485827404703-89b55fcc595e', 
    '1526374965328-b997f432fbf4', 
    '1517048676732-d65af271572d', 
    '1519389950473-47ba0277781c', 
    '1451187580459-43490279c0fa', 
    '1581091226825-a6a2a5aee158', 
    '1531297484001-80022131f5a1', 
    '1558494949-ef010c7191e4'  
  ];

  
  const techCore = [
    'Artificial Intelligence', 'Machine Learning', 'MERN Stack', 
    'Full-Stack Development', 'Competitive Programming', 'Cloud Architecture',
    'Cybersecurity Research', 'Web3 & Blockchain', 'Data Science Pipeline'
  ];
  
  const techExtensions = [
    'Global Summit', 'Masterclass', '24-Hour Hackathon', 
    'Workshop', 'Symposium', 'Networking Expo', 'Bootcamp'
  ];

  const locations = ['Pune', 'Bangalore', 'Mumbai', 'Delhi'];
  const companies = ['Meta', 'Google', 'NVIDIA', 'Vercel', 'Prisma', 'Stripe', 'OpenAI'];

  
  console.log('🗑️ Clearing events...');
  await prisma.event.deleteMany();

  
  console.log('🚀 Generating 50 Tech Events with verified imagery...');
  
  for (let i = 0; i < 50; i++) {
    const core = techCore[i % techCore.length];
    const ext = techExtensions[i % techExtensions.length];
    const location = locations[i % locations.length];
    const company = companies[i % companies.length];
    const imageId = imageIds[i % imageIds.length];
    
    const date = new Date();
    date.setMonth(date.getMonth() + Math.floor(Math.random() * 6) + 1);

    await prisma.event.create({
      data: {
        title: `${core} ${ext} by ${company}`,
        description: `Experience the cutting edge of ${core}. Join global pioneers for a comprehensive ${ext} focusing on production-grade systems and scalable innovation. Hosted at the ${location} innovation hub.`,
        date: date,
        location: `${location}, India`,
        capacity: 100 + (Math.floor(Math.random() * 14) * 100),
        
        imageUrl: `https://images.unsplash.com/photo-${imageId}?q=80&w=2070&auto=format&fit=crop&sat=-100`,
        organizerId: organizer.id,
      },
    });

    if (i % 10 === 0) console.log(`📦 Seeded ${i} tech events...`);
  }

  console.log('✨ Seeding completed successfully (50 Events)!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
