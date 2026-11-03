const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Read MONGODB_URI directly from .env.local
let MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/MONGODB_URI=(.+)/);
    if (match) {
      MONGODB_URI = match[1].trim();
    }
  }
}

const categoriesData = [
  {
    id: 'cat-1',
    name: 'Build',
    slug: 'build',
    description: 'Construction sets and engineering toys.',
    icon: 'Hammer',
    badgeColor: '#D97706',
    badgeBg: '#FEF3C7',
    bannerImage: '/products/TOY-0002.jpg',
    itemCount: 1,
  },
  {
    id: 'cat-2',
    name: 'Play',
    slug: 'play',
    description: 'Robots, moving vehicles, and interactive toys.',
    icon: 'Gamepad2',
    badgeColor: '#E11D48',
    badgeBg: '#FFE4E6',
    bannerImage: '/products/TOY-0005.jpg',
    itemCount: 4,
  },
  {
    id: 'cat-3',
    name: 'Discover',
    slug: 'discover',
    description: 'Night lamps, starry lights, and exploration gear.',
    icon: 'Telescope',
    badgeColor: '#0284C7',
    badgeBg: '#E0F2FE',
    bannerImage: '/products/TOY-0001.jpg',
    itemCount: 2,
  },
  {
    id: 'cat-4',
    name: 'Create',
    slug: 'create',
    description: 'Drawing boards, craft pens, and artistic tools.',
    icon: 'Palette',
    badgeColor: '#9333EA',
    badgeBg: '#F3E8FF',
    bannerImage: '/products/TOY-0006.jpg',
    itemCount: 1,
  },
  {
    id: 'cat-5',
    name: 'Learn',
    slug: 'learn',
    description: 'Montessori cards, learning laptops, sound books, and practice tools.',
    icon: 'GraduationCap',
    badgeColor: '#059669',
    badgeBg: '#D1FAE5',
    bannerImage: '/products/TOY-0010.jpg',
    itemCount: 6,
  },
];

const productsData = [
  {
    _id: 'prod-001',
    title: 'Toy Imagine Night Projector Lamp 360° Rotating LED Starry Light with Moon, Ocean Wave & Astronaut Effects Rechargeable Lamp for Bedroom Décor Multicolor Gift for All Ages',
    slug: 'toy-imagine-night-projector-lamp-360-rotating-led',
    sku: 'TOY-0001',
    description: 'Toy Imagine Night Projector Lamp 360° Rotating LED Starry Light with Moon, Ocean Wave & Astronaut Effects Rechargeable Lamp for Bedroom Décor Multicolor Gift for All Ages.',
    shortDescription: '360° Rotating LED Starry Light with Moon, Ocean Wave & Astronaut Effects.',
    category: 'discover',
    categoryName: 'Discover',
    brand: 'Toy Imagine',
    ageGroup: 'All Ages',
    price: 799,
    mrp: 999,
    purchasePrice: 560,
    discountPercent: 20,
    stock: 24,
    images: ['/products/TOY-0001.jpg'],
    featuredImage: '/products/TOY-0001.jpg',
    features: [
      '360° Rotating LED Starry Light',
      'Moon, Ocean Wave & Astronaut Effects',
      'Rechargeable bedside lamp'
    ],
    specifications: {
      'SKU': 'TOY-0001',
      'Marketplace Reference (Amazon)': '₹999',
      'Marketplace Reference (Meesho)': 'Starting 672 to 956',
      'Inventory Snapshot Date': '27-Aug-2026',
    },
    rating: 4.9,
    reviewCount: 28,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isDealOfTheDay: false,
    status: 'active',
  },
  {
    _id: 'prod-002',
    title: '3D Printing Pen for Kids & Adults | 3D Drawing Pen with LCD Display | Adjustable Temperature & Speed | Supports PLA & ABS Filament | Creative Art Craft Tool',
    slug: '3d-printing-pen-lcd-display-temperature-control',
    sku: 'TOY-0002',
    description: '3D Printing Pen for Kids & Adults | 3D Drawing Pen with LCD Display | Adjustable Temperature & Speed | Supports PLA & ABS Filament | Creative Art Craft Tool.',
    shortDescription: '3D Drawing Pen with LCD Display, Adjustable Temperature & Speed.',
    category: 'create',
    categoryName: 'Create',
    brand: 'Unbranded / Generic',
    ageGroup: '6-8 Years',
    price: 649,
    mrp: 899,
    purchasePrice: 370,
    discountPercent: 28,
    stock: 2,
    images: ['/products/TOY-0002.jpg'],
    featuredImage: '/products/TOY-0002.jpg',
    features: [
      'LCD Display for temperature',
      'Adjustable speed and temperature control',
      'Supports PLA and ABS filaments'
    ],
    specifications: {
      'SKU': 'TOY-0002',
      'Marketplace Reference (Amazon)': '₹899',
      'Marketplace Reference (Meesho)': '₹628',
      'Inventory Snapshot Date': '27-Aug-2026',
    },
    rating: 4.8,
    reviewCount: 19,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    isDealOfTheDay: false,
    status: 'active',
  },
  {
    _id: 'prod-003',
    title: 'Storio Tweetie Sliding Track Set Toys for Kids - Ducklings Stair Climbing Toys for Kids, Escalator Toy with Lights and Music with 3 Duckling',
    slug: 'storio-tweetie-sliding-track-set-escalator-ducklings',
    sku: 'TOY-0003',
    description: 'Storio Tweetie Sliding Track Set Toys for Kids - Ducklings Stair Climbing Toys for Kids, Escalator Toy with Lights and Music with 3 Duckling.',
    shortDescription: 'Ducklings stair climbing escalator toy with lights and music.',
    category: 'play',
    categoryName: 'Play',
    brand: 'Storio',
    ageGroup: '3-5 Years',
    price: 349,
    mrp: 429,
    purchasePrice: 177,
    discountPercent: 19,
    stock: 3,
    images: ['/products/TOY-0003.jpg'],
    featuredImage: '/products/TOY-0003.jpg',
    features: [
      'Motorized escalator stair climber',
      'Includes 3 sliding ducklings',
      'Lights and cheerful music'
    ],
    specifications: {
      'SKU': 'TOY-0003',
      'Marketplace Reference (Amazon)': '₹429',
      'Marketplace Reference (Meesho)': '₹301',
      'Inventory Snapshot Date': '27-Aug-2026',
    },
    rating: 4.7,
    reviewCount: 34,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    isDealOfTheDay: false,
    status: 'active',
  },
  {
    _id: 'prod-004',
    title: 'Gooyo GY-2020A Educational Learning Laptop Toy with LED Display and Musical Effects | Play & Learn with Fun | Indoor Toy for Kids | Educational Toy | Pink | 3xAA Battery (Not Included)',
    slug: 'gooyo-educational-learning-laptop-led-display',
    sku: 'TOY-0004',
    description: 'Gooyo GY-2020A Educational Learning Laptop Toy with LED Display and Musical Effects | Play & Learn with Fun | Indoor Toy for Kids | Educational Toy | Pink | 3xAA Battery (Not Included).',
    shortDescription: 'Kids educational laptop toy with LED display and musical effects.',
    category: 'learn',
    categoryName: 'Learn',
    brand: 'Gooyo',
    ageGroup: '3-5 Years',
    price: 329,
    mrp: 369,
    purchasePrice: 240,
    discountPercent: 11,
    stock: 4,
    images: ['/products/TOY-0004.jpg'],
    featuredImage: '/products/TOY-0004.jpg',
    features: [
      'LED display and musical effects',
      'Play & Learn early educational modes',
      'Pink edition'
    ],
    specifications: {
      'SKU': 'TOY-0004',
      'Model': 'GY-2020A',
      'Marketplace Reference (Amazon)': '₹369',
      'Marketplace Reference (Meesho)': '₹323',
      'Battery': '3xAA (Not Included)',
      'Inventory Snapshot Date': '27-Aug-2026',
    },
    rating: 4.6,
    reviewCount: 15,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    isDealOfTheDay: false,
    status: 'active',
  },
  {
    _id: 'prod-005',
    title: 'Bot Robot Pioneer Colorful Lights and Music All Direction Movement Dancing Robot Toys for Boys and Girls (Color as per Stock Availability)',
    slug: 'bot-robot-pioneer-colorful-lights-music-dancing-robot',
    sku: 'TOY-0005',
    description: 'Bot Robot Pioneer Colorful Lights and Music All Direction Movement Dancing Robot Toys for Boys and Girls (Color as per Stock Availability).',
    shortDescription: 'All-direction dancing robot with colorful lights and music.',
    category: 'play',
    categoryName: 'Play',
    brand: 'Bot Robot Pioneer',
    ageGroup: '3-5 Years',
    price: 549,
    mrp: 689,
    purchasePrice: 420,
    discountPercent: 20,
    stock: 50,
    images: ['/products/TOY-0005.jpg'],
    featuredImage: '/products/TOY-0005.jpg',
    features: [
      'All direction movement and dancing action',
      'Colorful lights and music',
      'Color as per stock availability'
    ],
    specifications: {
      'SKU': 'TOY-0005',
      'Marketplace Reference (Amazon)': '₹689',
      'Marketplace Reference (Meesho)': '₹621',
      'Inventory Snapshot Date': '27-Aug-2026',
    },
    rating: 4.8,
    reviewCount: 42,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isDealOfTheDay: true,
    status: 'active',
  },
  {
    _id: 'prod-006',
    title: 'LCD drawing Board Panel, LCD Panel Board, Size 8.5" Multicolour Black, Pink, Blue, Green',
    slug: 'lcd-drawing-board-panel-8-5-inch-multicolour',
    sku: 'TOY-0006',
    description: 'LCD drawing Board Panel, LCD Panel Board, Size 8.5" Multicolour Black, Pink, Blue, Green.',
    shortDescription: '8.5" Multicolour LCD writing and drawing board panel.',
    category: 'create',
    categoryName: 'Create',
    brand: 'Unbranded / Generic',
    ageGroup: '3-5 Years',
    price: 249,
    mrp: 299,
    purchasePrice: 210,
    discountPercent: 17,
    stock: 12,
    images: ['/products/TOY-0006.jpg'],
    featuredImage: '/products/TOY-0006.jpg',
    features: [
      '8.5 inch LCD drawing panel',
      'Multicolour writing surface',
      'Assorted border colors: Black, Pink, Blue, Green'
    ],
    specifications: {
      'SKU': 'TOY-0006',
      'Screen Size': '8.5 Inches',
      'Marketplace Reference (Amazon)': '₹299',
      'Marketplace Reference (Meesho)': '₹150',
      'Inventory Snapshot Date': '27-Aug-2026',
    },
    rating: 4.7,
    reviewCount: 51,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    isDealOfTheDay: false,
    status: 'active',
  },
  {
    _id: 'prod-007',
    title: 'Dancing Jellyfish Toy for Kids with Music, LED Lights & 360° Bump-and-Go Action – Battery Operated Cartoon Jellyfish Robot Play Kitchen Accessories',
    slug: 'dancing-jellyfish-toy-music-led-bump-and-go',
    sku: 'TOY-0007',
    description: 'Dancing Jellyfish Toy for Kids with Music, LED Lights & 360° Bump-and-Go Action – Battery Operated Cartoon Jellyfish Robot.',
    shortDescription: 'Battery operated dancing jellyfish with 360° bump-and-go action, music, and LEDs.',
    category: 'play',
    categoryName: 'Play',
    brand: 'Cartoon Jellyfish',
    ageGroup: '0-2 Years',
    price: 399,
    mrp: 499,
    purchasePrice: 330,
    discountPercent: 20,
    stock: 3,
    images: ['/products/TOY-0007.jpg'],
    featuredImage: '/products/TOY-0007.jpg',
    features: [
      '360° bump-and-go automated steering',
      'LED lighting and musical sounds',
      'Animated moving tentacles'
    ],
    specifications: {
      'SKU': 'TOY-0007',
      'Marketplace Reference (Amazon)': '₹499',
      'Marketplace Reference (Meesho)': '₹512',
      'Inventory Snapshot Date': '27-Aug-2026',
    },
    rating: 4.8,
    reviewCount: 12,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    isDealOfTheDay: false,
    status: 'active',
  },
  {
    _id: 'prod-008',
    title: 'Cute Panda LED Night Lamp for Kids Bedside Illumination',
    slug: 'cute-panda-led-night-lamp-for-kids',
    sku: 'TOY-0008',
    description: 'Cute Panda LED Night Lamp for Kids Bedside Illumination.',
    shortDescription: 'Adorable Panda LED night lamp for children bedside lighting.',
    category: 'discover',
    categoryName: 'Discover',
    brand: 'Panda Lights',
    ageGroup: 'All Ages',
    price: 329,
    mrp: 400,
    purchasePrice: 209,
    discountPercent: 18,
    stock: 2,
    images: ['/products/TOY-0008.jpg'],
    featuredImage: '/products/TOY-0008.jpg',
    features: [
      'Cute panda character design',
      'Gentle LED night illumination'
    ],
    specifications: {
      'SKU': 'TOY-0008',
      'Marketplace Reference (Amazon)': '₹400',
      'Marketplace Reference (Meesho)': '₹250',
      'Inventory Snapshot Date': '27-Aug-2026',
    },
    rating: 4.9,
    reviewCount: 23,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    isDealOfTheDay: false,
    status: 'active',
  },
  {
    _id: 'prod-009',
    title: 'Sank Magic Practice Copybook, (4 BOOK + 1 PEN + 10 REFILL) Number Tracing Book for Preschoolers with Pen, Magic calligraphy books for kids Reusable Writing Tool',
    slug: 'sank-magic-practice-copybook-4-books-pen-refills',
    sku: 'TOY-0009',
    description: 'Sank Magic Practice Copybook, (4 BOOK + 1 PEN + 10 REFILL) Number Tracing Book for Preschoolers with Pen, Magic calligraphy books for kids Reusable Writing Tool.',
    shortDescription: 'Reusable calligraphy and number tracing copybook set with magic pen.',
    category: 'learn',
    categoryName: 'Learn',
    brand: 'Sank Magic',
    ageGroup: '3-5 Years',
    price: 199,
    mrp: 267,
    purchasePrice: 85,
    discountPercent: 25,
    stock: 4,
    images: ['/products/TOY-0009.jpg'],
    featuredImage: '/products/TOY-0009.jpg',
    features: [
      'Includes 4 books, 1 pen, and 10 refills',
      'Disappearing magic ink for repeated writing practice',
      'Grooved lettering guides'
    ],
    specifications: {
      'SKU': 'TOY-0009',
      'Package Includes': '4 Books + 1 Pen + 10 Refills',
      'Marketplace Reference (Amazon)': '₹267',
      'Marketplace Reference (Meesho)': '₹132',
      'Inventory Snapshot Date': '27-Aug-2026',
    },
    rating: 4.9,
    reviewCount: 67,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    isDealOfTheDay: false,
    status: 'active',
  },
  {
    _id: 'prod-010',
    title: 'Educational Phone Type-C Rechargeable Musical Toy 28 Functions, Alphabet, Numbers, Varnmala, Animal Sounds, Nursery Rhymes in English & Hindi for Age 2&10 Years (Unicorn Model)',
    slug: 'educational-phone-type-c-rechargeable-musical-toy',
    sku: 'TOY-0010',
    description: 'Educational Phone Type-C Rechargeable Musical Toy 28 Functions, Alphabet, Numbers, Varnmala, Animal Sounds, Nursery Rhymes in English & Hindi for Age 2&10 Years (Unicorn Model).',
    shortDescription: 'Type-C rechargeable bilingual musical learning phone with 28 functions.',
    category: 'learn',
    categoryName: 'Learn',
    brand: 'Unicorn Model',
    ageGroup: '0-2 Years',
    price: 249,
    mrp: 299,
    purchasePrice: 178,
    discountPercent: 17,
    stock: 5,
    images: ['/products/TOY-0010.jpg'],
    featuredImage: '/products/TOY-0010.jpg',
    features: [
      '28 interactive functions: Alphabet, Numbers, Varnamala, Animal Sounds',
      'English & Hindi bilingual nursery rhymes',
      'Type-C rechargeable battery'
    ],
    specifications: {
      'SKU': 'TOY-0010',
      'Charging': 'Type-C USB',
      'Marketplace Reference (Amazon)': '₹299',
      'Marketplace Reference (Meesho)': '₹284',
      'Inventory Snapshot Date': '27-Aug-2026',
    },
    rating: 4.7,
    reviewCount: 18,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    isDealOfTheDay: false,
    status: 'active',
  },
  {
    _id: 'prod-011',
    title: 'Talking, Rechargeable, Electronic Flash Cards Learning Toy, 110+ Interactive Double Sided Montessori Cards for 2–5 Year Old Boys, Educational Toy for 3 Year Old, Birthday Gift for Kids (Pack 1)',
    slug: 'talking-rechargeable-electronic-flash-cards-learning-toy',
    sku: 'TOY-0011',
    description: 'Talking, Rechargeable, Electronic Flash Cards Learning Toy, 110+ Interactive Double Sided Montessori Cards for 2–5 Year Old Boys, Educational Toy for 3 Year Old, Birthday Gift for Kids.',
    shortDescription: '110+ Interactive double-sided electronic talking Montessori cards.',
    category: 'learn',
    categoryName: 'Learn',
    brand: 'Montessori Cards',
    ageGroup: '3-5 Years',
    price: 279,
    mrp: 309,
    purchasePrice: 200,
    discountPercent: 10,
    stock: 3,
    images: ['/products/TOY-0011.jpg'],
    featuredImage: '/products/TOY-0011.jpg',
    features: [
      '110+ double-sided audio cards',
      'Auditory pronunciation and sound effects',
      'Rechargeable battery'
    ],
    specifications: {
      'SKU': 'TOY-0011',
      'Card Count': '110+ Double Sided Cards',
      'Marketplace Reference (Amazon)': '₹309',
      'Marketplace Reference (Meesho)': '₹261',
      'Inventory Snapshot Date': '27-Aug-2026',
    },
    rating: 4.8,
    reviewCount: 29,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: false,
    isDealOfTheDay: false,
    status: 'active',
  },
  {
    _id: 'prod-012',
    title: 'Talking, Rechargeable, Electronic Flash Cards Learning Toy, 110+ Interactive Double Sided Montessori Cards for 2–5 Year Old Boys, Educational Toy for 3 Year Old, Birthday Gift for Kids (Pack 2 / Bulk Edition)',
    slug: 'talking-rechargeable-electronic-flash-cards-value-pack',
    sku: 'TOY-0012',
    description: 'Talking, Rechargeable, Electronic Flash Cards Learning Toy, 110+ Interactive Double Sided Montessori Cards for 2–5 Year Old Boys, Educational Toy for 3 Year Old, Birthday Gift for Kids.',
    shortDescription: '110+ Interactive double-sided electronic talking Montessori cards (Batch 2).',
    category: 'learn',
    categoryName: 'Learn',
    brand: 'Montessori Cards',
    ageGroup: '0-2 Years',
    price: 219,
    mrp: 249,
    purchasePrice: 160,
    discountPercent: 12,
    stock: 103,
    images: ['/products/TOY-0012.jpg'],
    featuredImage: '/products/TOY-0012.jpg',
    features: [
      '110+ double-sided audio cards',
      'Auditory pronunciation device',
      'Rechargeable battery'
    ],
    specifications: {
      'SKU': 'TOY-0012',
      'Marketplace Reference (Amazon)': '₹249',
      'Marketplace Reference (Meesho)': '₹294',
      'Inventory Snapshot Date': '27-Aug-2026',
    },
    rating: 4.8,
    reviewCount: 38,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    isDealOfTheDay: false,
    status: 'active',
  },
  {
    _id: 'prod-013',
    title: 'Wembley Dancing Monkey Musical Toy for Kids Baby Spinning Rolling Doll Tumble Toy with Voice Control Musical Light and Sound Effects with Sensor - ISI Mark - Multicolor',
    slug: 'wembley-dancing-monkey-musical-toy-sound-sensor',
    sku: 'TOY-0013',
    description: 'Wembley Dancing Monkey Musical Toy for Kids Baby Spinning Rolling Doll Tumble Toy with Voice Control Musical Light and Sound Effects with Sensor - ISI Mark - Multicolor.',
    shortDescription: 'Voice control tumbling spinning monkey with light and sound effects, ISI certified.',
    category: 'play',
    categoryName: 'Play',
    brand: 'Wembley',
    ageGroup: '0-2 Years',
    price: 199,
    mrp: 223,
    purchasePrice: 150,
    discountPercent: 11,
    stock: 3,
    images: ['/products/TOY-0013.jpg'],
    featuredImage: '/products/TOY-0013.jpg',
    features: [
      'Voice control & clap sensor activation',
      '360° spinning and rolling tumbling motion',
      'ISI Certified Indian Standards Mark'
    ],
    specifications: {
      'SKU': 'TOY-0013',
      'Brand': 'Wembley',
      'Safety Mark': 'ISI Certified',
      'Marketplace Reference (Amazon)': '₹223',
      'Marketplace Reference (Meesho)': '₹242',
      'Inventory Snapshot Date': '27-Aug-2026',
    },
    rating: 4.6,
    reviewCount: 14,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    isDealOfTheDay: false,
    status: 'active',
  },
  {
    _id: 'prod-014',
    title: 'LAALIYA Kids Interactive Sound Book | Touch & Play Musical Learning Book with ABC, Words, Rhymes, Animal Sounds & Activities | Educational Talking',
    slug: 'laaliya-kids-interactive-sound-book-touch-play',
    sku: 'TOY-0014',
    description: 'LAALIYA Kids Interactive Sound Book | Touch & Play Musical Learning Book with ABC, Words, Rhymes, Animal Sounds & Activities | Educational Talking.',
    shortDescription: 'Touch & Play musical audio book with alphabet, words, rhymes, and activities.',
    category: 'learn',
    categoryName: 'Learn',
    brand: 'LAALIYA',
    ageGroup: '3-5 Years',
    price: 349,
    mrp: 489,
    purchasePrice: 170,
    discountPercent: 29,
    stock: 20,
    images: ['/products/TOY-0014.jpg'],
    featuredImage: '/products/TOY-0014.jpg',
    features: [
      'Touch & play sound touchpoints',
      'Alphabet, vocabulary words, rhymes & animal sounds',
      'Interactive quiz and learning activities'
    ],
    specifications: {
      'SKU': 'TOY-0014',
      'Brand': 'LAALIYA',
      'Marketplace Reference (Amazon)': '₹489',
      'Marketplace Reference (Meesho)': '₹283',
      'Inventory Snapshot Date': '27-Aug-2026',
    },
    rating: 4.9,
    reviewCount: 45,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isDealOfTheDay: false,
    status: 'active',
  },
];

async function seed() {
  console.log('--- 1. Updating local data/store.json ---');
  const storeFilePath = path.join(__dirname, '..', 'data', 'store.json');
  let currentStore = {};
  if (fs.existsSync(storeFilePath)) {
    try {
      currentStore = JSON.parse(fs.readFileSync(storeFilePath, 'utf8'));
    } catch (e) {
      currentStore = {};
    }
  }

  currentStore.categories = categoriesData;
  currentStore.products = productsData;
  if (!currentStore.orders) currentStore.orders = [];
  if (!currentStore.users) {
    currentStore.users = [
      {
        _id: 'user-admin-001',
        name: 'Toy Store Admin',
        email: 'admin@toyzz.com',
        role: 'admin',
        isEmailVerified: true,
        isPhoneVerified: true,
        addresses: [],
        createdAt: new Date().toISOString(),
      }
    ];
  }
  if (!currentStore.coupons) currentStore.coupons = [];

  fs.mkdirSync(path.dirname(storeFilePath), { recursive: true });
  fs.writeFileSync(storeFilePath, JSON.stringify(currentStore, null, 2), 'utf8');
  console.log('✅ Local store.json updated with 14 active products and verified categories.');

  if (!MONGODB_URI) {
    console.log('⚠️ No MONGODB_URI found, skipping Atlas sync.');
    process.exit(0);
  }

  console.log('--- 2. Connecting to MongoDB Atlas ---');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB Atlas cluster0.cf5tmd8.mongodb.net/toyzz');

  const db = mongoose.connection.db;

  // Seed Categories
  const categoriesCol = db.collection('categories');
  await categoriesCol.deleteMany({});
  await categoriesCol.insertMany(categoriesData.map(c => ({ ...c, createdAt: new Date(), updatedAt: new Date() })));
  console.log(`✅ Seeded ${categoriesData.length} categories into MongoDB.`);

  // Seed Products
  const productsCol = db.collection('products');
  await productsCol.deleteMany({});
  await productsCol.insertMany(productsData.map(p => ({ ...p, createdAt: new Date(), updatedAt: new Date() })));
  console.log(`✅ Seeded ${productsData.length} active showroom products with verified prices into MongoDB.`);

  // Ensure Admin User exists in MongoDB
  const usersCol = db.collection('users');
  const adminExists = await usersCol.findOne({ email: 'admin@toyzz.com' });
  if (!adminExists) {
    await usersCol.insertOne({
      _id: 'user-admin-001',
      name: 'Toy Store Admin',
      email: 'admin@toyzz.com',
      passwordHash: '$2a$10$wT0l0hD2ZpU6uFzX4y3lueH7aEaUaF8o5Y.87gKk7c8qGkL4Z/v6e',
      role: 'admin',
      isEmailVerified: true,
      isPhoneVerified: true,
      registrationMethod: 'email',
      addresses: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✅ Seeded store admin user into MongoDB.');
  }

  console.log('\n🎉 ALL DATA SUCCESSFULLY POPULATED IN MONGODB ATLAS!');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
