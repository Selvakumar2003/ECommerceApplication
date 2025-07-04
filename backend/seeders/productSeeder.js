const { sequelize } = require('../config/database');
const { Product } = require('../models');

const seedProducts = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    // Clear existing products
    await Product.destroy({ where: {} });

    // Sample products - 50 total products with categories
    const products = [
      // Electronics - Computers & Laptops (10 products)
      {
        name: 'MacBook Pro 16"',
        description: 'Apple MacBook Pro 16-inch with M2 Pro chip, 16GB RAM, 512GB SSD. Perfect for professional work and creative tasks.',
        price: 2499.99,
        category: 'Electronics',
        image: 'https://www.notebookcheck.net/fileadmin/_processed_/9/7/csm_IMG_7743_defa0cb064.jpg',
        stock: 8
      },
      {
        name: 'Dell XPS 13',
        description: 'Ultra-portable laptop with 13.4-inch InfinityEdge display, Intel Core i7, 16GB RAM, 512GB SSD.',
        price: 1299.99,
        category: 'Electronics',
        image: 'https://kalingatv.com/wp-content/uploads/2022/08/cad3d3f88de54017cf4193dcf7032f3d.jpg',
        stock: 10
      },
      {
        name: 'Microsoft Surface Pro 9',
        description: '2-in-1 laptop tablet with 13-inch touchscreen, Intel Core i5, 8GB RAM, 256GB SSD.',
        price: 999.99,
        category: 'Electronics',
        image: 'https://sm.pcmag.com/t/pcmag_au/review/m/microsoft-/microsoft-surface-pro-9-intel_upxu.1920.jpg',
        stock: 14
      },
      {
        name: 'HP Spectre x360',
        description: '2-in-1 premium laptop with 13.5-inch OLED touchscreen, Intel Core i7, 16GB RAM, 1TB SSD.',
        price: 1599.99,
        category: 'Electronics',
        image: 'https://img-cdn.tnwcdn.com/image?fit=1280%2C720&url=https%3A%2F%2Fcdn0.tnwcdn.com%2Fwp-content%2Fblogs.dir%2F1%2Ffiles%2F2021%2F08%2FHP-Spectre-x360-14-1-of-7.jpg&signature=b273734ba382a58d403431a960fd1708',
        stock: 7
      },
      {
        name: 'Lenovo ThinkPad X1 Carbon',
        description: 'Business laptop with 14-inch display, Intel Core i7, 16GB RAM, 512GB SSD, military-grade durability.',
        price: 1899.99,
        category: 'Electronics',
        image: 'https://p3-ofp.static.pub//fes/cms/2024/07/05/05dhzg0lrtq4i0d3wxqyjjakwmbmzr331426.png',
        stock: 9
      },
      {
        name: 'ASUS ROG Strix G15',
        description: 'Gaming laptop with AMD Ryzen 7, NVIDIA RTX 3070, 16GB RAM, 1TB SSD, 15.6-inch 144Hz display.',
        price: 1799.99,
        category: 'Electronics',
        image: 'https://dlcdnwebimgs.asus.com/gain/3E266260-8939-41ED-A42D-1CEEC7CA410D',
        stock: 12
      },
      {
        name: 'Acer Predator Helios 300',
        description: 'High-performance gaming laptop with Intel Core i7, RTX 3060, 16GB RAM, 512GB SSD.',
        price: 1399.99,
        category: 'Electronics',
        image: 'https://rukminim2.flixcart.com/image/750/900/jmwch3k0/computer/z/f/b/acer-na-gaming-laptop-original-imaf9ph3zd7b4b2s.jpeg?q=90&crop=false',
        stock: 11
      },
      {
        name: 'MacBook Air M2',
        description: 'Apple MacBook Air with M2 chip, 8GB RAM, 256GB SSD, 13.6-inch Liquid Retina display.',
        price: 1199.99,
        category: 'Electronics',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1653084303665',
        stock: 16
      },
      {
        name: 'Surface Laptop Studio',
        description: 'Microsoft Surface Laptop Studio with Intel Core i7, 16GB RAM, 512GB SSD, unique hinge design.',
        price: 2099.99,
        category: 'Electronics',
        image: 'https://m.media-amazon.com/images/I/61vqI0vw94L._UF1000,1000_QL80_.jpg',
        stock: 6
      },
      {
        name: 'Razer Blade 15',
        description: 'Premium gaming laptop with Intel Core i7, RTX 3080, 32GB RAM, 1TB SSD, 15.6-inch 240Hz display.',
        price: 2799.99,
        category: 'Electronics',
        image: 'https://images-cdn.ubuy.co.in/63400858e9b1f646087b81e4-razer-blade-15-gaming-laptop-2019-intel.jpg',
        stock: 5
      },

      // Electronics - Smartphones (8 products)
      {
        name: 'iPhone 15 Pro',
        description: 'Latest iPhone 15 Pro with A17 Pro chip, 128GB storage, ProRAW camera system, and titanium design.',
        price: 999.99,
        category: 'Electronics',
        image: 'https://static1.xdaimages.com/wordpress/wp-content/uploads/2023/09/iphone-15-pro-max-apple-watch-202305738.jpg',
        stock: 25
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Premium Android smartphone with S Pen, 200MP camera, 12GB RAM, 256GB storage.',
        price: 1199.99,
        category: 'Electronics',
        image: 'https://th.bing.com/th/id/OIP.seDkZ7w_josZda-_44JlyQHaE8?r=0&rs=1&pid=ImgDetMain&cb=idpwebp2&o=7&rm=3',
        stock: 20
      },
      {
        name: 'Google Pixel 8 Pro',
        description: 'Google Pixel 8 Pro with Tensor G3 chip, advanced AI features, 12GB RAM, 128GB storage.',
        price: 899.99,
        category: 'Electronics',
        image: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1724266735/Croma%20Assets/Communication/Mobiles/Images/309134_0_cv9vxa.png',
        stock: 18
      },
      {
        name: 'OnePlus 11',
        description: 'OnePlus 11 with Snapdragon 8 Gen 2, 16GB RAM, 256GB storage, 100W fast charging.',
        price: 699.99,
        category: 'Electronics',
        image: 'https://m.media-amazon.com/images/I/61amb0CfMGL.jpg',
        stock: 22
      },
      {
        name: 'iPhone 14',
        description: 'iPhone 14 with A15 Bionic chip, dual-camera system, 128GB storage, available in multiple colors.',
        price: 799.99,
        category: 'Electronics',
        image: 'https://techcrunch.com/wp-content/uploads/2022/09/Apple-iphone-14-Pro-review-1.jpeg',
        stock: 30
      },
      {
        name: 'Xiaomi 13 Pro',
        description: 'Xiaomi 13 Pro with Snapdragon 8 Gen 2, Leica camera system, 12GB RAM, 256GB storage.',
        price: 899.99,
        category: 'Electronics',
        image: 'https://m.media-amazon.com/images/I/61RvCwjI7dL._UF1000,1000_QL80_.jpg',
        stock: 15
      },
      {
        name: 'Nothing Phone 2',
        description: 'Nothing Phone 2 with unique transparent design, Snapdragon 8+ Gen 1, 12GB RAM, 256GB storage.',
        price: 599.99,
        category: 'Electronics',
        image: 'https://rukminim2.flixcart.com/image/850/1000/xif0q/mobile/q/y/m/-original-imagz7f9hzrahd2z.jpeg?q=90&crop=false',
        stock: 13
      },
      {
        name: 'Sony Xperia 1 V',
        description: 'Sony Xperia 1 V with 4K OLED display, pro camera features, Snapdragon 8 Gen 2, 12GB RAM.',
        price: 1299.99,
        category: 'Electronics',
        image: 'https://m.media-amazon.com/images/I/61SPQ9SnfpL._UF1000,1000_QL80_.jpg',
        stock: 8
      },

      // Electronics - Audio (7 products)
      {
        name: 'Sony WH-1000XM5',
        description: 'Industry-leading noise canceling wireless headphones with 30-hour battery life and premium sound quality.',
        price: 399.99,
        category: 'Electronics',
        image: 'https://www.slashgear.com/img/gallery/sony-wh-1000xm5-review-the-price-of-more-clarity/l-intro-1653078671.jpg',
        stock: 15
      },
      {
        name: 'AirPods Pro 2nd Gen',
        description: 'Apple AirPods Pro with active noise cancellation, spatial audio, and MagSafe charging case.',
        price: 249.99,
        category: 'Electronics',
        image: 'https://www.rollingstone.com/wp-content/uploads/2022/09/Apple-AirPods-Pro-2nd-gen-hero-220907.jpg?w=1600&h=900&crop=1',
        stock: 35
      },
      {
        name: 'Bose QuietComfort Earbuds',
        description: 'True wireless earbuds with world-class noise cancellation and high-fidelity audio.',
        price: 279.99,
        category: 'Electronics',
        image: 'https://cdn.vox-cdn.com/thumbor/z8OmTC5dqCue5V0UM_ZVfW4RltI=/0x0:2040x1360/1400x1400/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24024005/DSCF9291_3.jpg',
        stock: 30
      },
      {
        name: 'Sennheiser Momentum 4',
        description: 'Premium wireless headphones with adaptive noise cancellation and 60-hour battery life.',
        price: 349.99,
        category: 'Electronics',
        image: 'https://i.pcmag.com/imagery/reviews/01hWI2ubSNns4pG5XNg4Ovy-4..v1660226139.jpg',
        stock: 12
      },
      {
        name: 'Audio-Technica ATH-M50xBT2',
        description: 'Professional wireless headphones with exceptional clarity and 50-hour battery life.',
        price: 199.99,
        category: 'Electronics',
        image: 'https://m.media-amazon.com/images/I/81SFQgzPyuL.jpg',
        stock: 20
      },
      {
        name: 'Marshall Major IV',
        description: 'Iconic wireless headphones with signature Marshall sound and 80+ hour wireless playtime.',
        price: 149.99,
        category: 'Electronics',
        image: 'https://images-cdn.ubuy.co.in/66133a55ace4fa47db290381-marshall-major-iv-bluetooth-on-ear.jpg',
        stock: 25
      },
      {
        name: 'JBL Flip 6',
        description: 'Portable Bluetooth speaker with powerful sound, IP67 waterproof rating, and 12-hour playtime.',
        price: 129.99,
        category: 'Electronics',
        image: 'https://media.jointlook.com/customPhotos/productImages/jbl-flip-6-wireless-portable-speakers-JLMSP62-08.jpg',
        stock: 40
      },

      // Electronics - Tablets & Wearables (5 products)
      {
        name: 'iPad Air 5th Gen',
        description: 'iPad Air with M1 chip, 10.9-inch Liquid Retina display, 64GB storage. Perfect for creativity and productivity.',
        price: 599.99,
        category: 'Electronics',
        image: 'https://www.pcguide.com/wp-content/uploads/2021/09/EA47C2CD-9360-42C2-B02B-D944E1142953-750x469.jpeg',
        stock: 12
      },
      {
        name: 'Apple Watch Ultra',
        description: 'Most rugged and capable Apple Watch with 49mm titanium case, GPS + Cellular, and up to 60 hours battery.',
        price: 799.99,
        category: 'Electronics',
        image: 'https://www.macworld.com/wp-content/uploads/2023/01/Apple-Watch-Ultra_-review_9-1.jpg?quality=50&strip=all',
        stock: 18
      },
      {
        name: 'Samsung Galaxy Tab S9',
        description: 'Premium Android tablet with 11-inch display, Snapdragon 8 Gen 2, S Pen included, 128GB storage.',
        price: 799.99,
        category: 'Electronics',
        image: 'https://images.samsung.com/is/image/samsung/p6pim/in/feature/165710941/in-feature-galaxy-tab-s-544066568?$FB_TYPE_A_MO_JPG$',
        stock: 10
      },
      {
        name: 'Samsung Galaxy Watch 6',
        description: 'Advanced smartwatch with health monitoring, GPS, sleep tracking, and 40-hour battery life.',
        price: 329.99,
        category: 'Electronics',
        image: 'https://sell.gameloot.in/wp-content/uploads/sites/4/2023/12/Samsung-Galaxy-Watch6-40mm-4G-Graphite.jpg',
        stock: 22
      },
      {
        name: 'Microsoft Surface Go 3',
        description: 'Compact 2-in-1 tablet with 10.5-inch touchscreen, Intel Pentium Gold, 8GB RAM, 128GB SSD.',
        price: 549.99,
        category: 'Electronics',
        image: 'https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSFT-collection-of-Accessories-RWGDbG:VP1-539x349',
        stock: 14
      },

      // Gaming (5 products)
      {
        name: 'Nintendo Switch OLED',
        description: 'Gaming console with 7-inch OLED screen, enhanced audio, 64GB internal storage.',
        price: 349.99,
        category: 'Gaming',
        image: 'https://www.nme.com/wp-content/uploads/2021/07/Nintendo-Switch-OLED-model-2.jpg',
        stock: 22
      },
      {
        name: 'PlayStation 5',
        description: 'Sony PlayStation 5 console with ultra-high speed SSD, ray tracing, and 4K gaming capabilities.',
        price: 499.99,
        category: 'Gaming',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3K91Qg045WDJyH2Iso0IWEl8roU9GJS9WnA&s',
        stock: 8
      },
      {
        name: 'Xbox Series X',
        description: 'Microsoft Xbox Series X with 12 teraflops GPU, 4K gaming, and backward compatibility.',
        price: 499.99,
        category: 'Gaming',
        image: 'https://images-cdn.ubuy.co.in/6592825801490a50be31f9cd-2021-newest-xbox-series-x-gaming.jpg',
        stock: 10
      },
      {
        name: 'Steam Deck',
        description: 'Portable gaming device that runs PC games, 7-inch touchscreen, AMD APU, 512GB SSD.',
        price: 649.99,
        category: 'Gaming',
        image: 'https://m.media-amazon.com/images/I/516sb3osGJL._UF894,1000_QL80_.jpg',
        stock: 6
      },
      {
        name: 'ASUS ROG Ally',
        description: 'Handheld gaming PC with AMD Ryzen Z1 Extreme, 7-inch 120Hz display, Windows 11.',
        price: 699.99,
        category: 'Gaming',
        image: 'https://dlcdnwebimgs.asus.com/files/media/C03ED571-0D4B-47B3-90B0-BEF72BB26C05/v1/images/large/1x/nr2501_kv.png',
        stock: 7
      },

      // Photography (3 products)
      {
        name: 'Canon EOS R6 Mark II',
        description: 'Full-frame mirrorless camera with 24.2MP sensor, 4K video recording, and advanced autofocus system.',
        price: 2499.99,
        category: 'Photography',
        image: 'https://i.pinimg.com/originals/49/67/bd/4967bd91d1eba80a8f8e9d2666998ef3.jpg',
        stock: 6
      },
      {
        name: 'Sony A7 IV',
        description: 'Full-frame mirrorless camera with 33MP sensor, 4K 60p video, real-time autofocus tracking.',
        price: 2498.00,
        category: 'Photography',
        image: 'https://x.imastudent.com/content/0039132_sony-a7-iv-mirrorless-camera-with-24-105mm-f4-lens-kit_500.jpeg',
        stock: 5
      },
      {
        name: 'Fujifilm X-T5',
        description: 'APS-C mirrorless camera with 40.2MP sensor, in-body stabilization, and film simulation modes.',
        price: 1699.99,
        category: 'Photography',
        image: 'https://camnext.in/wp-content/uploads/2024/02/76034eb1203a43f3a00222035914bd6d-other-other.jpg',
        stock: 8
      },

      // Home & Kitchen (5 products)
      {
        name: 'Dyson V15 Detect',
        description: 'Cordless vacuum cleaner with laser dust detection, powerful suction, and up to 60 minutes runtime.',
        price: 749.99,
        category: 'Home & Kitchen',
        image: 'https://bsmedia.business-standard.com/_media/bs/img/article/2022-07/25/full/1658745494-2801.jpg?im=FeatureCrop,size=(826,465)',
        stock: 12
      },
      {
        name: 'KitchenAid Stand Mixer',
        description: 'Professional 5-quart stand mixer with 10 speeds, tilt-head design, and multiple attachments.',
        price: 449.99,
        category: 'Home & Kitchen',
        image: 'https://m.media-amazon.com/images/I/51HXid8ExKL.jpg',
        stock: 15
      },
      {
        name: 'Ninja Foodi Air Fryer',
        description: '8-quart air fryer with multiple cooking functions, crisping basket, and easy-to-clean design.',
        price: 199.99,
        category: 'Home & Kitchen',
        image: 'https://images-cdn.ubuy.co.in/64cada365bc35b6e0d56ebbe-ninja-foodi-fd302-11-in-1-6-5-qt-pro.jpg',
        stock: 20
      },
      {
        name: 'Instant Pot Duo Plus',
        description: '6-quart multi-use pressure cooker with 15 smart programs and stainless steel inner pot.',
        price: 119.99,
        category: 'Home & Kitchen',
        image: 'https://images-cdn.ubuy.co.in/6646b23f6f71880ed944f625-instant-pot-112-0156-01-duo-plus-9-in-1.jpg',
        stock: 25
      },
      {
        name: 'Breville Barista Express',
        description: 'Espresso machine with built-in grinder, steam wand, and pre-infusion for perfect coffee extraction.',
        price: 699.99,
        category: 'Home & Kitchen',
        image: 'https://caramelly.in/cdn/shop/products/sagebreville-the-barista-express-impress-espresso-machine-ses876-258152_1600x.jpg?v=1681597856',
        stock: 8
      },

      // Fashion (7 products)
      {
        name: 'Nike Air Jordan 1 Retro High',
        description: 'Classic basketball sneakers with premium leather upper, Air cushioning, and iconic design.',
        price: 170.00,
        category: 'Fashion',
        image: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-jordan-1-retro-high-og-shoes-Pn93fM.png',
        stock: 30
      },
      {
        name: 'Adidas Ultraboost 22',
        description: 'Performance running shoes with responsive Boost midsole, Primeknit upper, and Continental rubber outsole.',
        price: 190.00,
        category: 'Fashion',
        image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fbaf991a78bc4896a3e9ad7800abcec6_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg',
        stock: 25
      },
      {
        name: 'Levi\'s 501 Original Jeans',
        description: 'Classic straight-fit jeans with button fly, made from 100% cotton denim in timeless blue wash.',
        price: 89.99,
        category: 'Fashion',
        image: 'https://levi.in/cdn/shop/files/798300241_02_Front_6c2cf9f0-ea03-45cf-810d-64a62ce53404.jpg?v=1739622201&width=1445',
        stock: 40
      },
      {
        name: 'Ray-Ban Aviator Classic',
        description: 'Iconic aviator sunglasses with metal frame, crystal lenses, and 100% UV protection.',
        price: 154.00,
        category: 'Fashion',
        image: 'https://5.imimg.com/data5/SELLER/Default/2022/1/SB/HU/JT/3831996/ray-ban-aviator-sunglasses.png',
        stock: 35
      },
      {
        name: 'The North Face Nuptse Jacket',
        description: 'Insulated down jacket with water-resistant finish, packable design, and iconic baffle construction.',
        price: 279.00,
        category: 'Fashion',
        image: 'https://cdn-images.farfetch-contents.com/26/05/10/11/26051011_56214976_1000.jpg',
        stock: 18
      },
      {
        name: 'Converse Chuck Taylor All Star',
        description: 'Classic canvas sneakers with rubber toe cap, high-top design, and timeless style.',
        price: 65.00,
        category: 'Fashion',
        image: 'https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dwf4c71a1f/images/a_107/M9160_A_107X1.jpg?sw=964',
        stock: 50
      },
      {
        name: 'Apple Watch Sport Band',
        description: 'Durable fluoroelastomer sport band for Apple Watch, sweat and water resistant, multiple colors available.',
        price: 49.00,
        category: 'Fashion',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MY9N2?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1566956666881',
        stock: 100
      }
    ];

    await Product.bulkCreate(products);
    console.log('Products seeded successfully!');
    console.log(`${products.length} products added to the database.`);
    
    // Log category breakdown
    const categoryCount = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\nCategory breakdown:');
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`${category}: ${count} products`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();