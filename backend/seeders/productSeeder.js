const { sequelize } = require('../config/database');
const { Product } = require('../models');

const seedProducts = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    // Clear existing products
    await Product.destroy({ where: {} });

    // Sample products - 50 total products
    const products = [
      // Electronics - Computers & Laptops (10 products)
      {
        name: 'MacBook Pro 16"',
        description: 'Apple MacBook Pro 16-inch with M2 Pro chip, 16GB RAM, 512GB SSD. Perfect for professional work and creative tasks.',
        price: 2499.99,
        image: 'https://www.notebookcheck.net/fileadmin/_processed_/9/7/csm_IMG_7743_defa0cb064.jpg',
        stock: 8
      },
      {
        name: 'Dell XPS 13',
        description: 'Ultra-portable laptop with 13.4-inch InfinityEdge display, Intel Core i7, 16GB RAM, 512GB SSD.',
        price: 1299.99,
        image: 'https://kalingatv.com/wp-content/uploads/2022/08/cad3d3f88de54017cf4193dcf7032f3d.jpg',
        stock: 10
      },
      {
        name: 'Microsoft Surface Pro 9',
        description: '2-in-1 laptop tablet with 13-inch touchscreen, Intel Core i5, 8GB RAM, 256GB SSD.',
        price: 999.99,
        image: 'https://sm.pcmag.com/t/pcmag_au/review/m/microsoft-/microsoft-surface-pro-9-intel_upxu.1920.jpg',
        stock: 14
      },
      {
        name: 'HP Spectre x360',
        description: '2-in-1 premium laptop with 13.5-inch OLED touchscreen, Intel Core i7, 16GB RAM, 1TB SSD.',
        price: 1599.99,
        image: 'https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c07791531.png',
        stock: 7
      },
      {
        name: 'Lenovo ThinkPad X1 Carbon',
        description: 'Business laptop with 14-inch display, Intel Core i7, 16GB RAM, 512GB SSD, military-grade durability.',
        price: 1899.99,
        image: 'https://www.lenovo.com/medias/lenovo-laptop-thinkpad-x1-carbon-gen-9-14-intel-hero.png?context=bWFzdGVyfHJvb3R8MTQzNzQ4fGltYWdlL3BuZ3xoYWMvaDQ2LzEwOTQ4NTgzNDI0MDMwLnBuZ3xmNzQzNzJmNGI4ZGZmNzk4YzU4YjI2MzRkNmI4NzNhMmI2MjJmNjUwNzUzMGZhNjJkNDkyOTU5YjI4MzIyNjEx',
        stock: 9
      },
      {
        name: 'ASUS ROG Strix G15',
        description: 'Gaming laptop with AMD Ryzen 7, NVIDIA RTX 3070, 16GB RAM, 1TB SSD, 15.6-inch 144Hz display.',
        price: 1799.99,
        image: 'https://dlcdnwebimgs.asus.com/gain/c2c967e3-7a86-4a36-9bb9-6ac87b9dc56c/',
        stock: 12
      },
      {
        name: 'Acer Predator Helios 300',
        description: 'High-performance gaming laptop with Intel Core i7, RTX 3060, 16GB RAM, 512GB SSD.',
        price: 1399.99,
        image: 'https://static.acer.com/up/Resource/Acer/Laptops/Predator_Helios_300/Images/20210512/Acer-Predator-Helios-300-PH315-54-modelpreview.png',
        stock: 11
      },
      {
        name: 'MacBook Air M2',
        description: 'Apple MacBook Air with M2 chip, 8GB RAM, 256GB SSD, 13.6-inch Liquid Retina display.',
        price: 1199.99,
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1653084303665',
        stock: 16
      },
      {
        name: 'Surface Laptop Studio',
        description: 'Microsoft Surface Laptop Studio with Intel Core i7, 16GB RAM, 512GB SSD, unique hinge design.',
        price: 2099.99,
        image: 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RW16TLy?ver=1566',
        stock: 6
      },
      {
        name: 'Razer Blade 15',
        description: 'Premium gaming laptop with Intel Core i7, RTX 3080, 32GB RAM, 1TB SSD, 15.6-inch 240Hz display.',
        price: 2799.99,
        image: 'https://assets2.razerzone.com/images/pnx.assets/618c0b065e55fe1d23f5ac1ccf82d9f7/razer-blade-15-ch9-hero-mobile.jpg',
        stock: 5
      },

      // Electronics - Smartphones (8 products)
      {
        name: 'iPhone 15 Pro',
        description: 'Latest iPhone 15 Pro with A17 Pro chip, 128GB storage, ProRAW camera system, and titanium design.',
        price: 999.99,
        image: 'https://static1.xdaimages.com/wordpress/wp-content/uploads/2023/09/iphone-15-pro-max-apple-watch-202305738.jpg',
        stock: 25
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Premium Android smartphone with S Pen, 200MP camera, 12GB RAM, 256GB storage.',
        price: 1199.99,
        image: 'https://th.bing.com/th/id/OIP.seDkZ7w_josZda-_44JlyQHaE8?r=0&rs=1&pid=ImgDetMain&cb=idpwebp2&o=7&rm=3',
        stock: 20
      },
      {
        name: 'Google Pixel 8 Pro',
        description: 'Google Pixel 8 Pro with Tensor G3 chip, advanced AI features, 12GB RAM, 128GB storage.',
        price: 899.99,
        image: 'https://lh3.googleusercontent.com/35pC5_R3FFNot3AJLXS_lOa_EbEGALHnuVf8EnGRdDNKj-2RJPb7L4tCf8lVQYD5SvOUPKl_lYlQhJXa=rw-e365-w1440',
        stock: 18
      },
      {
        name: 'OnePlus 11',
        description: 'OnePlus 11 with Snapdragon 8 Gen 2, 16GB RAM, 256GB storage, 100W fast charging.',
        price: 699.99,
        image: 'https://onemobile.pk/images/detailed/84/OnePlus_11_5G_Eternal_Green-f.jpg',
        stock: 22
      },
      {
        name: 'iPhone 14',
        description: 'iPhone 14 with A15 Bionic chip, dual-camera system, 128GB storage, available in multiple colors.',
        price: 799.99,
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-finish-select-202209-6-1inch-blue?wid=5120&hei=2880&fmt=heic&qlt=80&.v=1660689912719',
        stock: 30
      },
      {
        name: 'Xiaomi 13 Pro',
        description: 'Xiaomi 13 Pro with Snapdragon 8 Gen 2, Leica camera system, 12GB RAM, 256GB storage.',
        price: 899.99,
        image: 'https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1672736926.48081307.jpg',
        stock: 15
      },
      {
        name: 'Nothing Phone 2',
        description: 'Nothing Phone 2 with unique transparent design, Snapdragon 8+ Gen 1, 12GB RAM, 256GB storage.',
        price: 599.99,
        image: 'https://nothing.tech/cdn/shop/files/Phone-2-render-White_e6bda3c5-5baf-4c0c-9d2a-2f6cf2d3a5a0.png?v=1689173086',
        stock: 13
      },
      {
        name: 'Sony Xperia 1 V',
        description: 'Sony Xperia 1 V with 4K OLED display, pro camera features, Snapdragon 8 Gen 2, 12GB RAM.',
        price: 1299.99,
        image: 'https://www.sony.com/image/5d02f6d7e06295eb5c5b364a96473b80?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF',
        stock: 8
      },

      // Electronics - Audio (7 products)
      {
        name: 'Sony WH-1000XM5',
        description: 'Industry-leading noise canceling wireless headphones with 30-hour battery life and premium sound quality.',
        price: 399.99,
        image: 'https://www.slashgear.com/img/gallery/sony-wh-1000xm5-review-the-price-of-more-clarity/l-intro-1653078671.jpg',
        stock: 15
      },
      {
        name: 'AirPods Pro 2nd Gen',
        description: 'Apple AirPods Pro with active noise cancellation, spatial audio, and MagSafe charging case.',
        price: 249.99,
        image: 'https://www.rollingstone.com/wp-content/uploads/2022/09/Apple-AirPods-Pro-2nd-gen-hero-220907.jpg?w=1600&h=900&crop=1',
        stock: 35
      },
      {
        name: 'Bose QuietComfort Earbuds',
        description: 'True wireless earbuds with world-class noise cancellation and high-fidelity audio.',
        price: 279.99,
        image: 'https://cdn.vox-cdn.com/thumbor/z8OmTC5dqCue5V0UM_ZVfW4RltI=/0x0:2040x1360/1400x1400/filters:focal(1020x680:1021x681)/cdn.vox-cdn.com/uploads/chorus_asset/file/24024005/DSCF9291_3.jpg',
        stock: 30
      },
      {
        name: 'Sennheiser Momentum 4',
        description: 'Premium wireless headphones with adaptive noise cancellation and 60-hour battery life.',
        price: 349.99,
        image: 'https://assets.sennheiser.com/img/19526/square_loupeimage_momentum_4_wireless_01_sq_sennheiser.png',
        stock: 12
      },
      {
        name: 'Audio-Technica ATH-M50xBT2',
        description: 'Professional wireless headphones with exceptional clarity and 50-hour battery life.',
        price: 199.99,
        image: 'https://eu.audio-technica.com/media/catalog/product/a/t/ath-m50xbt2_01.jpg',
        stock: 20
      },
      {
        name: 'Marshall Major IV',
        description: 'Iconic wireless headphones with signature Marshall sound and 80+ hour wireless playtime.',
        price: 149.99,
        image: 'https://marshall.com/cdn/shop/files/major-iv-black-hero_600x600.jpg?v=1646143836',
        stock: 25
      },
      {
        name: 'JBL Flip 6',
        description: 'Portable Bluetooth speaker with powerful sound, IP67 waterproof rating, and 12-hour playtime.',
        price: 129.99,
        image: 'https://in.jbl.com/dw/image/v2/BFND_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/default/dw3e6d8ebc/JBL_FLIP6_HERO_BLACK_0094_x1.png?sw=537&sfrm=png',
        stock: 40
      },

      // Electronics - Tablets & Wearables (5 products)
      {
        name: 'iPad Air 5th Gen',
        description: 'iPad Air with M1 chip, 10.9-inch Liquid Retina display, 64GB storage. Perfect for creativity and productivity.',
        price: 599.99,
        image: 'https://www.pcguide.com/wp-content/uploads/2021/09/EA47C2CD-9360-42C2-B02B-D944E1142953-750x469.jpeg',
        stock: 12
      },
      {
        name: 'Apple Watch Ultra',
        description: 'Most rugged and capable Apple Watch with 49mm titanium case, GPS + Cellular, and up to 60 hours battery.',
        price: 799.99,
        image: 'https://www.macworld.com/wp-content/uploads/2023/01/Apple-Watch-Ultra_-review_9-1.jpg?quality=50&strip=all',
        stock: 18
      },
      {
        name: 'Samsung Galaxy Tab S9',
        description: 'Premium Android tablet with 11-inch display, Snapdragon 8 Gen 2, S Pen included, 128GB storage.',
        price: 799.99,
        image: 'https://images.samsung.com/is/image/samsung/p6pim/in/2307/gallery/in-galaxy-tab-s9-x710-sm-x710nzaeinu-537458965?$650_519_PNG$',
        stock: 10
      },
      {
        name: 'Samsung Galaxy Watch 6',
        description: 'Advanced smartwatch with health monitoring, GPS, sleep tracking, and 40-hour battery life.',
        price: 329.99,
        image: 'https://images.samsung.com/is/image/samsung/p6pim/in/2307/gallery/in-galaxy-watch6-r940-sm-r940nzsainu-537460197?$650_519_PNG$',
        stock: 22
      },
      {
        name: 'Microsoft Surface Go 3',
        description: 'Compact 2-in-1 tablet with 10.5-inch touchscreen, Intel Pentium Gold, 8GB RAM, 128GB SSD.',
        price: 549.99,
        image: 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RW17Kvh?ver=e7ff',
        stock: 14
      },

      // Gaming (5 products)
      {
        name: 'Nintendo Switch OLED',
        description: 'Gaming console with 7-inch OLED screen, enhanced audio, 64GB internal storage.',
        price: 349.99,
        image: 'https://www.nme.com/wp-content/uploads/2021/07/Nintendo-Switch-OLED-model-2.jpg',
        stock: 22
      },
      {
        name: 'PlayStation 5',
        description: 'Sony PlayStation 5 console with ultra-high speed SSD, ray tracing, and 4K gaming capabilities.',
        price: 499.99,
        image: 'https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21?$facebook$',
        stock: 8
      },
      {
        name: 'Xbox Series X',
        description: 'Microsoft Xbox Series X with 12 teraflops GPU, 4K gaming, and backward compatibility.',
        price: 499.99,
        image: 'https://assets.xboxservices.com/assets/fb/d2/fbd2cb8f-5a88-4065-bd0e-9245415ca2c4.jpg?n=Xbox-Series-X_Image-0001_1920x1080.jpg',
        stock: 10
      },
      {
        name: 'Steam Deck',
        description: 'Portable gaming device that runs PC games, 7-inch touchscreen, AMD APU, 512GB SSD.',
        price: 649.99,
        image: 'https://cdn.cloudflare.steamstatic.com/steamdeck/images/steamdeck_hero_01.jpg',
        stock: 6
      },
      {
        name: 'ASUS ROG Ally',
        description: 'Handheld gaming PC with AMD Ryzen Z1 Extreme, 7-inch 120Hz display, Windows 11.',
        price: 699.99,
        image: 'https://dlcdnwebimgs.asus.com/gain/a4ba0f5d-4827-4747-9621-0a7d0a1f7de3/',
        stock: 7
      },

      // Photography (3 products)
      {
        name: 'Canon EOS R6 Mark II',
        description: 'Full-frame mirrorless camera with 24.2MP sensor, 4K video recording, and advanced autofocus system.',
        price: 2499.99,
        image: 'https://i.pinimg.com/originals/49/67/bd/4967bd91d1eba80a8f8e9d2666998ef3.jpg',
        stock: 6
      },
      {
        name: 'Sony A7 IV',
        description: 'Full-frame mirrorless camera with 33MP sensor, 4K 60p video, real-time autofocus tracking.',
        price: 2498.00,
        image: 'https://www.sony.com/image/5d856f9a5d74c08b4e5c6e7e4b0c5b3f?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF',
        stock: 5
      },
      {
        name: 'Fujifilm X-T5',
        description: 'APS-C mirrorless camera with 40.2MP sensor, in-body stabilization, and film simulation modes.',
        price: 1699.99,
        image: 'https://fujifilm-x.com/wp-content/uploads/2022/11/x-t5_silver_frontback.png',
        stock: 8
      },

      // Home & Kitchen (5 products)
      {
        name: 'Dyson V15 Detect',
        description: 'Cordless vacuum cleaner with laser dust detection, powerful suction, and up to 60 minutes runtime.',
        price: 749.99,
        image: 'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/products/vacuums/upright/dyson-v15-detect/dyson-v15-detect-gold-purple-hero-01.png',
        stock: 12
      },
      {
        name: 'KitchenAid Stand Mixer',
        description: 'Professional 5-quart stand mixer with 10 speeds, tilt-head design, and multiple attachments.',
        price: 449.99,
        image: 'https://kitchenaid-h.assetsadobe.com/is/image/content/dam/business-unit/kitchenaid/en-us/marketing-content/site-assets/page-content/pinch-of-help/how-to-use-kitchenaid-stand-mixer/how-to-use-a-kitchenaid-stand-mixer-hero.jpg?wid=986&hei=555&fmt=jpg&qlt=85',
        stock: 15
      },
      {
        name: 'Ninja Foodi Air Fryer',
        description: '8-quart air fryer with multiple cooking functions, crisping basket, and easy-to-clean design.',
        price: 199.99,
        image: 'https://ninjakitchen.com/wp-content/uploads/2021/09/FD401_NinjaFoodiPersonalBlender_Straight_2000x2000.png',
        stock: 20
      },
      {
        name: 'Instant Pot Duo Plus',
        description: '6-quart multi-use pressure cooker with 15 smart programs and stainless steel inner pot.',
        price: 119.99,
        image: 'https://instantbrands.com/wp-content/uploads/2021/09/IP-DUO-Plus-60-SSfront-BEAUTY-1.jpg',
        stock: 25
      },
      {
        name: 'Breville Barista Express',
        description: 'Espresso machine with built-in grinder, steam wand, and pre-infusion for perfect coffee extraction.',
        price: 699.99,
        image: 'https://www.breville.com/content/dam/breville/us/assets/espresso/bes870xl/bes870xl-1.jpg',
        stock: 8
      },

      // Fashion (7 products)
      {
        name: 'Nike Air Jordan 1 Retro High',
        description: 'Classic basketball sneakers with premium leather upper, Air cushioning, and iconic design.',
        price: 170.00,
        image: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-jordan-1-retro-high-og-shoes-Pn93fM.png',
        stock: 30
      },
      {
        name: 'Adidas Ultraboost 22',
        description: 'Performance running shoes with responsive Boost midsole, Primeknit upper, and Continental rubber outsole.',
        price: 190.00,
        image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fbaf991a78bc4896a3e9ad7800abcec6_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg',
        stock: 25
      },
      {
        name: 'Levi\'s 501 Original Jeans',
        description: 'Classic straight-fit jeans with button fly, made from 100% cotton denim in timeless blue wash.',
        price: 89.99,
        image: 'https://lsco.scene7.com/is/image/lsco/005010000-front-pdp-lse?fmt=jpeg&qlt=70,1&op_sharpen=0&resMode=sharp2&op_usm=0.8,1,10,0&fit=crop,0&wid=750&hei=1000',
        stock: 40
      },
      {
        name: 'Ray-Ban Aviator Classic',
        description: 'Iconic aviator sunglasses with metal frame, crystal lenses, and 100% UV protection.',
        price: 154.00,
        image: 'https://assets.ray-ban.com/is/image/RayBan/8056597177788__STD__shad__qt.png?impolicy=RB_Product',
        stock: 35
      },
      {
        name: 'The North Face Nuptse Jacket',
        description: 'Insulated down jacket with water-resistant finish, packable design, and iconic baffle construction.',
        price: 279.00,
        image: 'https://images.thenorthface.com/is/image/TheNorthFace/NF0A3C8D_JK3_hero?wid=1200&hei=1396&fmt=jpeg&qlt=90&bgcolor=f8f8f8',
        stock: 18
      },
      {
        name: 'Converse Chuck Taylor All Star',
        description: 'Classic canvas sneakers with rubber toe cap, high-top design, and timeless style.',
        price: 65.00,
        image: 'https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dwf4c71a1f/images/a_107/M9160_A_107X1.jpg?sw=964',
        stock: 50
      },
      {
        name: 'Apple Watch Sport Band',
        description: 'Durable fluoroelastomer sport band for Apple Watch, sweat and water resistant, multiple colors available.',
        price: 49.00,
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MY9N2?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1566956666881',
        stock: 100
      }
    ];

    await Product.bulkCreate(products);
    console.log('Products seeded successfully!');
    console.log(`${products.length} products added to the database.`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();