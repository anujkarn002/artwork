-- Sample Data for Artwork Platform
-- Run this after the schema setup script
-- Insert Sample Regions
INSERT INTO regions (id, name, state, description, image_url)
VALUES (
        uuid_generate_v4(),
        'Jaipur',
        'Rajasthan',
        'Known for its rich heritage of handicrafts including blue pottery, block printing, and jewelry making.',
        'https://images.unsplash.com/photo-1599661046827-9d04a8f5a55f'
    ),
    (
        uuid_generate_v4(),
        'Banaras',
        'Uttar Pradesh',
        'Famous for Banarasi silk sarees and brocades with intricate designs.',
        'https://images.unsplash.com/photo-1561361398-a8cb5c0f3f10'
    ),
    (
        uuid_generate_v4(),
        'Pochampally',
        'Telangana',
        'Home to the unique Ikat weaving technique and handloom traditions.',
        'https://images.unsplash.com/photo-1596400953538-0f5deb6a778f'
    ),
    (
        uuid_generate_v4(),
        'Patan',
        'Gujarat',
        'Famous for Patola silk sarees with double ikat weaving.',
        'https://images.unsplash.com/photo-1598774805963-e5a21cb4fe90'
    ),
    (
        uuid_generate_v4(),
        'Thanjavur',
        'Tamil Nadu',
        'Known for bronze sculptures, paintings, and temple art forms.',
        'https://images.unsplash.com/photo-1606826772760-b54f4bc654cd'
    ),
    (
        uuid_generate_v4(),
        'Kashmir Valley',
        'Jammu & Kashmir',
        'Renowned for Pashmina shawls, carpets, and wood carving.',
        'https://images.unsplash.com/photo-1591170715252-abc0fdc0ade3'
    ),
    (
        uuid_generate_v4(),
        'Madhubani',
        'Bihar',
        'Famous for Madhubani painting, an ancient folk art tradition.',
        'https://images.unsplash.com/photo-1600420399585-1ee7f95a593f'
    ),
    (
        uuid_generate_v4(),
        'Moradabad',
        'Uttar Pradesh',
        'Known as the Brass City of India, famous for brassware.',
        'https://images.unsplash.com/photo-1615704731993-60e985b60939'
    );
-- Insert Craft Categories
INSERT INTO craft_categories (id, name, description, image_url)
VALUES (
        uuid_generate_v4(),
        'Textiles',
        'Traditional textiles including weaving, printing, and embroidery techniques.',
        'https://images.unsplash.com/photo-1529374814797-82feb0e8111f'
    ),
    (
        uuid_generate_v4(),
        'Pottery',
        'Clay pottery and ceramic crafts in various traditional styles.',
        'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261'
    ),
    (
        uuid_generate_v4(),
        'Metalwork',
        'Traditional metalwork including brass, copper, silver and gold crafts.',
        'https://images.unsplash.com/photo-1591341462947-6569aac61292'
    ),
    (
        uuid_generate_v4(),
        'Woodwork',
        'Wood carving and furniture making using traditional techniques.',
        'https://images.unsplash.com/photo-1598106619401-2efec7a4d987'
    ),
    (
        uuid_generate_v4(),
        'Paintings',
        'Traditional painting styles unique to different regions of India.',
        'https://images.unsplash.com/photo-1579762593175-20840bacb5ce'
    ),
    (
        uuid_generate_v4(),
        'Stone Craft',
        'Stone carving and sculpture using traditional techniques.',
        'https://images.unsplash.com/photo-1588871384075-660067504cbe'
    ),
    (
        uuid_generate_v4(),
        'Leather Craft',
        'Traditional techniques for creating leather goods and artifacts.',
        'https://images.unsplash.com/photo-1579421370176-28b352544bca'
    );
-- Save IDs for later use
DO $$
DECLARE textile_id UUID;
pottery_id UUID;
metalwork_id UUID;
painting_id UUID;
jaipur_id UUID;
banaras_id UUID;
pochampally_id UUID;
kashmir_id UUID;
madhubani_id UUID;
BEGIN -- Get category IDs
SELECT id INTO textile_id
FROM craft_categories
WHERE name = 'Textiles'
LIMIT 1;
SELECT id INTO pottery_id
FROM craft_categories
WHERE name = 'Pottery'
LIMIT 1;
SELECT id INTO metalwork_id
FROM craft_categories
WHERE name = 'Metalwork'
LIMIT 1;
SELECT id INTO painting_id
FROM craft_categories
WHERE name = 'Paintings'
LIMIT 1;
-- Get region IDs
SELECT id INTO jaipur_id
FROM regions
WHERE name = 'Jaipur'
LIMIT 1;
SELECT id INTO banaras_id
FROM regions
WHERE name = 'Banaras'
LIMIT 1;
SELECT id INTO pochampally_id
FROM regions
WHERE name = 'Pochampally'
LIMIT 1;
SELECT id INTO kashmir_id
FROM regions
WHERE name = 'Kashmir Valley'
LIMIT 1;
SELECT id INTO madhubani_id
FROM regions
WHERE name = 'Madhubani'
LIMIT 1;
-- Insert Crafts
INSERT INTO crafts (
        id,
        name,
        description,
        category_id,
        region_id,
        is_gi_tagged,
        gi_tag_year,
        historical_context,
        materials,
        techniques,
        cultural_significance,
        featured,
        image_url
    )
VALUES (
        uuid_generate_v4(),
        'Blue Pottery',
        'Jaipur Blue Pottery is a traditional craft with Persian influences. Known for its vibrant blue dye and intricate patterns.',
        pottery_id,
        jaipur_id,
        true,
        '2008',
        'Blue pottery came to Jaipur from Persia and Afghanistan via Mughal courts. The name comes from the eye-catching blue dye used to color the pottery.',
        '["Clay", "Quartz", "Raw glaze", "Sodium sulphate", "Fuller''s earth"]',
        '["Dough molding", "Sun drying", "Coloring", "Glazing", "Firing"]',
        'Blue Pottery represents the cultural fusion that happened during the Mughal era. It combines Turkish and Persian elements with Indian designs.',
        true,
        'https://images.unsplash.com/photo-1605883705077-8d0d5a6fa7b3'
    ),
    (
        uuid_generate_v4(),
        'Banarasi Silk',
        'Banarasi silk sarees are known for their gold and silver brocade or zari, fine silk, and opulent embroidery.',
        textile_id,
        banaras_id,
        true,
        '2009',
        'Banarasi silk weaving can be traced back to the Mughal era. The craft flourished during the 18th and 19th centuries.',
        '["Silk thread", "Zari (gold/silver thread)", "Natural dyes"]',
        '["Handloom weaving", "Jacquard technique", "Kadhua weaving", "Brocade work"]',
        'Banarasi silk sarees are an essential part of Indian wedding traditions and are considered a symbol of elegance and luxury.',
        true,
        'https://images.unsplash.com/photo-1614886136302-88e714572256'
    ),
    (
        uuid_generate_v4(),
        'Pochampally Ikat',
        'A traditional tie-dye textiles from Pochampally where the warp and weft threads are tie-dyed before weaving to create intricate patterns.',
        textile_id,
        pochampally_id,
        true,
        '2005',
        'Pochampally Ikat has a history of over 100 years and is believed to have originated from the Patan Patola of Gujarat.',
        '["Cotton", "Silk", "Natural dyes"]',
        '["Resist dyeing", "Pre-loom pattern creation", "Traditional handloom weaving"]',
        'Pochampally Ikat represents the mathematical precision of its weavers, with complex geometric patterns created without modern tools.',
        true,
        'https://images.unsplash.com/photo-1594819148002-c9637a29d082'
    ),
    (
        uuid_generate_v4(),
        'Pashmina Shawls',
        'Ultra-fine cashmere wool shawls known for their warmth, softness, and intricate embroidery.',
        textile_id,
        kashmir_id,
        true,
        '2014',
        'Pashmina shawls have been produced in Kashmir since the 15th century. They gained popularity in Europe during the 18th century.',
        '["Pashmina wool", "Silk thread", "Natural dyes"]',
        '["Hand spinning", "Hand weaving", "Sozni embroidery", "Kani weaving"]',
        'Pashmina represents the resilience of Kashmiri artisans, who have preserved this craft through centuries despite numerous challenges.',
        true,
        'https://images.unsplash.com/photo-1595459650318-f0f9c0243dd7'
    ),
    (
        uuid_generate_v4(),
        'Madhubani Painting',
        'A traditional folk art from the Mithila region with distinctive geometric patterns and mythological themes.',
        painting_id,
        madhubani_id,
        true,
        '2007',
        'Madhubani painting tradition dates back to the time of Ramayana, when King Janaka commissioned artists to create paintings for his daughter Sita''s wedding.',
        '["Handmade paper", "Canvas", "Cotton cloth", "Natural pigments", "Bamboo sticks"]',
        '["Line drawing", "Natural color application", "Double line border", "Symbolic motifs"]',
        'Madhubani paintings traditionally were created by women as a form of ritual and decorative art on walls and floors of homes.',
        false,
        'https://images.unsplash.com/photo-1582560475093-ba66accbc429'
    );
-- Create an admin user
-- Note: You'll need to sign up with this email via the app and then run this update
INSERT INTO profiles (id, full_name, role)
VALUES (
        'bfa78a0e-8445-429a-a0f1-f0a081b16f94',
        'Admin User',
        'admin'
    );
END $$;
-- Add more sample data based on the initial crafts
-- Create some artisan profiles
-- Note: You'll need to create users via auth.users first in a real setup
-- For demo purposes, we'll insert placeholder data
INSERT INTO profiles (
        id,
        full_name,
        avatar_url,
        bio,
        location,
        role,
        is_verified
    )
VALUES (
        'a39a3f9d-caa5-4745-9f64-697a6ca84d5f',
        'Lakshmi Devi',
        'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e',
        'Master weaver with over 30 years of experience in traditional techniques.',
        'Pochampally, Telangana',
        'artisan',
        true
    ),
    (
        '3dc30111-a0e9-4bd4-b50d-1d2391b213de',
        'Ramesh Kumar',
        'https://images.unsplash.com/photo-1568602471122-7832951cc4c5',
        'Third-generation potter specializing in Blue Pottery.',
        'Jaipur, Rajasthan',
        'artisan',
        true
    ),
    (
        'e6a3bb3a-9b75-496c-95e2-c3b8d44c253e',
        'Akbar Ali',
        'https://images.unsplash.com/photo-1566753323558-f4e0952af115',
        'Master craftsman working with Banarasi silk for 25 years.',
        'Varanasi, Uttar Pradesh',
        'artisan',
        true
    ),
    (
        '13522cfd-532c-45f2-892c-1962dd952215',
        'Sushma Kumari',
        'https://images.unsplash.com/photo-1619989370692-54aa38b23074',
        'Award-winning Madhubani artist preserving traditional techniques.',
        'Madhubani, Bihar',
        'artisan',
        true
    );
-- Link artisans to crafts
DO $$
DECLARE blue_pottery_id UUID;
banarasi_silk_id UUID;
pochampally_ikat_id UUID;
madhubani_painting_id UUID;
BEGIN -- Get craft IDs
SELECT id INTO blue_pottery_id
FROM crafts
WHERE name = 'Blue Pottery'
LIMIT 1;
SELECT id INTO banarasi_silk_id
FROM crafts
WHERE name = 'Banarasi Silk'
LIMIT 1;
SELECT id INTO pochampally_ikat_id
FROM crafts
WHERE name = 'Pochampally Ikat'
LIMIT 1;
SELECT id INTO madhubani_painting_id
FROM crafts
WHERE name = 'Madhubani Painting'
LIMIT 1;
-- Create artisan profiles
INSERT INTO artisan_profiles (
        id,
        craft_id,
        experience_years,
        is_master_artisan,
        story,
        verification_status,
        verified_at
    )
VALUES (
        'a39a3f9d-caa5-4745-9f64-697a6ca84d5f',
        pochampally_ikat_id,
        30,
        true,
        'I learned this craft from my mother when I was 12. Today, after 30 years, I have trained over 50 women in my village to preserve our tradition. Pochampally Ikat weaving has been in my family for generations, and each piece tells a story of our heritage.',
        'verified',
        now()
    ),
    (
        '3dc30111-a0e9-4bd4-b50d-1d2391b213de',
        blue_pottery_id,
        25,
        true,
        'I am a third-generation Blue Pottery artisan. My grandfather learned this craft during the 1950s revival of this art form. We still use the same techniques and patterns that have been passed down, making each piece by hand using natural materials.',
        'verified',
        now()
    ),
    (
        'e6a3bb3a-9b75-496c-95e2-c3b8d44c253e',
        banarasi_silk_id,
        25,
        true,
        'I started learning Banarasi silk weaving from my father when I was just 10. The intricate designs and patterns require immense concentration and skill. Each saree takes anywhere from 15 days to 6 months to complete, depending on the complexity of the design.',
        'verified',
        now()
    ),
    (
        '13522cfd-532c-45f2-892c-1962dd952215',
        madhubani_painting_id,
        20,
        true,
        'Madhubani painting is more than an art form for me—it is a way to preserve our stories and traditions. I learned from my grandmother, who would paint on the walls of our home during festivals and important occasions. Now I teach this art to younger generations to keep our cultural legacy alive.',
        'verified',
        now()
    );
-- Add sample awards
UPDATE artisan_profiles
SET awards = '[
    {"name": "National Award for Excellence in Handicrafts", "year": "2015", "description": "Awarded by the Ministry of Textiles for exceptional craftsmanship"},
    {"name": "State Crafts Award", "year": "2010", "description": "Recognized for contribution to traditional crafts"}
  ]'
WHERE id = 'a39a3f9d-caa5-4745-9f64-697a6ca84d5f';
UPDATE artisan_profiles
SET awards = '[
    {"name": "Shilp Guru Award", "year": "2018", "description": "Highest national honor for master craftspersons"},
    {"name": "Regional Craft Exhibition - First Prize", "year": "2012", "description": ""}
  ]'
WHERE id = '3dc30111-a0e9-4bd4-b50d-1d2391b213de';
END $$;
-- Add sample products
DO $$
DECLARE blue_pottery_id UUID;
banarasi_silk_id UUID;
pochampally_ikat_id UUID;
madhubani_painting_id UUID;
BEGIN -- Get craft IDs
SELECT id INTO blue_pottery_id
FROM crafts
WHERE name = 'Blue Pottery'
LIMIT 1;
SELECT id INTO banarasi_silk_id
FROM crafts
WHERE name = 'Banarasi Silk'
LIMIT 1;
SELECT id INTO pochampally_ikat_id
FROM crafts
WHERE name = 'Pochampally Ikat'
LIMIT 1;
SELECT id INTO madhubani_painting_id
FROM crafts
WHERE name = 'Madhubani Painting'
LIMIT 1;
-- Insert products
INSERT INTO products (
        id,
        artisan_id,
        craft_id,
        name,
        description,
        price,
        image_urls,
        stock_quantity,
        creation_time,
        is_featured
    )
VALUES (
        uuid_generate_v4(),
        '3dc30111-a0e9-4bd4-b50d-1d2391b213de',
        blue_pottery_id,
        'Blue Pottery Vase',
        'Handcrafted blue pottery vase with traditional floral motifs. Each piece is unique and made using centuries-old techniques.',
        2500,
        '{"https://images.unsplash.com/photo-1612196808214-b7e7e3509745"}',
        5,
        '10-15 days',
        true
    ),
    (
        uuid_generate_v4(),
        '3dc30111-a0e9-4bd4-b50d-1d2391b213de',
        blue_pottery_id,
        'Blue Pottery Tea Set',
        'Complete tea set with 4 cups and a teapot. Hand-painted with classic Jaipur blue pottery designs.',
        3800,
        '{"https://images.unsplash.com/photo-1577401239170-897942555fb3"}',
        3,
        '15-20 days',
        true
    ),
    (
        uuid_generate_v4(),
        'e6a3bb3a-9b75-496c-95e2-c3b8d44c253e',
        banarasi_silk_id,
        'Traditional Banarasi Saree',
        'Handwoven silk saree with gold and silver zari work. Features traditional motifs and borders.',
        15000,
        '{"https://images.unsplash.com/photo-1586102293241-b68bea403ae9"}',
        2,
        '45 days',
        true
    ),
    (
        uuid_generate_v4(),
        'e6a3bb3a-9b75-496c-95e2-c3b8d44c253e',
        banarasi_silk_id,
        'Banarasi Silk Dupatta',
        'Elegant silk dupatta with intricate zari work. Perfect for special occasions.',
        4500,
        '{"https://images.unsplash.com/photo-1598451630773-d0ad16a22944"}',
        8,
        '20 days',
        false
    ),
    (
        uuid_generate_v4(),
        'a39a3f9d-caa5-4745-9f64-697a6ca84d5f',
        pochampally_ikat_id,
        'Pochampally Ikat Saree',
        'Handwoven cotton Ikat saree with geometric patterns in natural dyes. Each piece takes 7-10 days to complete.',
        8500,
        '{"https://images.unsplash.com/photo-1601185573114-6f155797e4ad"}',
        4,
        '7-10 days',
        true
    ),
    (
        uuid_generate_v4(),
        'a39a3f9d-caa5-4745-9f64-697a6ca84d5f',
        pochampally_ikat_id,
        'Ikat Table Runner',
        'Handwoven Ikat table runner with traditional patterns. Made with natural dyes and organic cotton.',
        2200,
        '{"https://images.unsplash.com/photo-1604752422996-cedfee3bd8a3"}',
        10,
        '5 days',
        false
    ),
    (
        uuid_generate_v4(),
        '13522cfd-532c-45f2-892c-1962dd952215',
        madhubani_painting_id,
        'Traditional Madhubani Painting',
        'Original Madhubani painting on handmade paper, depicting scenes from Hindu mythology. Painted using natural pigments.',
        5500,
        '{"https://images.unsplash.com/photo-1582560379260-24302f473125"}',
        1,
        '15 days',
        true
    ),
    (
        uuid_generate_v4(),
        '13522cfd-532c-45f2-892c-1962dd952215',
        madhubani_painting_id,
        'Madhubani Art Wall Hanging',
        'Madhubani painting on cotton fabric, ready to hang. Features traditional motifs and vibrant colors.',
        3200,
        '{"https://images.unsplash.com/photo-1576626184183-ab37adb539c7"}',
        3,
        '10 days',
        false
    );
END $$;
-- Add customer profiles
INSERT INTO profiles (
        id,
        full_name,
        avatar_url,
        bio,
        location,
        role,
        is_verified
    )
VALUES (
        '782e0ec0-1760-401c-b2a5-300cb32d17b2',
        'Priya Singh',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        'Art enthusiast and collector of traditional Indian crafts.',
        'Mumbai, Maharashtra',
        'customer',
        true
    ),
    (
        '3eff42ca-79e4-4f78-9843-54474bd6892e',
        'Rahul Mehta',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
        'Interior designer with a passion for incorporating traditional crafts in modern spaces.',
        'Bangalore, Karnataka',
        'customer',
        true
    );
-- Add sample orders
INSERT INTO orders (
        id,
        customer_id,
        status,
        total_amount,
        shipping_address,
        created_at
    )
VALUES (
        uuid_generate_v4(),
        '782e0ec0-1760-401c-b2a5-300cb32d17b2',
        'delivered',
        15000,
        '{"name": "Priya Singh", "street": "123 Marine Drive", "city": "Mumbai", "state": "Maharashtra", "postal_code": "400001", "country": "India", "phone": "+919876543210"}',
        now() - interval '30 days'
    ),
    (
        uuid_generate_v4(),
        '782e0ec0-1760-401c-b2a5-300cb32d17b2',
        'shipped',
        5700,
        '{"name": "Priya Singh", "street": "123 Marine Drive", "city": "Mumbai", "state": "Maharashtra", "postal_code": "400001", "country": "India", "phone": "+919876543210"}',
        now() - interval '10 days'
    ),
    (
        uuid_generate_v4(),
        '3eff42ca-79e4-4f78-9843-54474bd6892e',
        'delivered',
        6400,
        '{"name": "Rahul Mehta", "street": "456 Indiranagar", "city": "Bangalore", "state": "Karnataka", "postal_code": "560038", "country": "India", "phone": "+919876543211"}',
        now() - interval '45 days'
    );
-- Link orders to products (sample order items)
DO $$
DECLARE order1_id UUID;
order2_id UUID;
order3_id UUID;
product1_id UUID;
product3_id UUID;
product5_id UUID;
product7_id UUID;
BEGIN -- Get order IDs
SELECT id INTO order1_id
FROM orders
ORDER BY created_at DESC
LIMIT 1 OFFSET 2;
SELECT id INTO order2_id
FROM orders
ORDER BY created_at DESC
LIMIT 1 OFFSET 1;
SELECT id INTO order3_id
FROM orders
ORDER BY created_at DESC
LIMIT 1 OFFSET 0;
-- Get product IDs (using the first one of each type for this example)
SELECT id INTO product1_id
FROM products
WHERE name = 'Blue Pottery Vase'
LIMIT 1;
SELECT id INTO product3_id
FROM products
WHERE name = 'Traditional Banarasi Saree'
LIMIT 1;
SELECT id INTO product5_id
FROM products
WHERE name = 'Pochampally Ikat Saree'
LIMIT 1;
SELECT id INTO product7_id
FROM products
WHERE name = 'Traditional Madhubani Painting'
LIMIT 1;
-- Insert order items
INSERT INTO order_items (
        id,
        order_id,
        product_id,
        quantity,
        price_at_purchase
    )
VALUES (
        uuid_generate_v4(),
        order1_id,
        product3_id,
        1,
        15000
    ),
    (
        uuid_generate_v4(),
        order2_id,
        product1_id,
        1,
        2500
    ),
    (
        uuid_generate_v4(),
        order2_id,
        product7_id,
        1,
        3200
    ),
    (
        uuid_generate_v4(),
        order3_id,
        product5_id,
        1,
        8500
    );
END $$;
-- Add sample reviews
DO $$
DECLARE product1_id UUID;
product3_id UUID;
product5_id UUID;
BEGIN -- Get product IDs
SELECT id INTO product1_id
FROM products
WHERE name = 'Blue Pottery Vase'
LIMIT 1;
SELECT id INTO product3_id
FROM products
WHERE name = 'Traditional Banarasi Saree'
LIMIT 1;
SELECT id INTO product5_id
FROM products
WHERE name = 'Pochampally Ikat Saree'
LIMIT 1;
-- Insert reviews
INSERT INTO reviews (
        id,
        product_id,
        customer_id,
        rating,
        comment,
        created_at
    )
VALUES (
        uuid_generate_v4(),
        product3_id,
        '782e0ec0-1760-401c-b2a5-300cb32d17b2',
        5,
        'Absolutely stunning saree! The craftsmanship is exceptional, and the zari work is even more beautiful in person. It arrived well-packaged and on time. Would definitely purchase again.',
        now() - interval '25 days'
    ),
    (
        uuid_generate_v4(),
        product1_id,
        '3eff42ca-79e4-4f78-9843-54474bd6892e',
        4,
        'Beautiful vase with intricate designs. The blue color is vibrant and exactly as shown in the photos. It makes a perfect centerpiece for my dining table.',
        now() - interval '40 days'
    ),
    (
        uuid_generate_v4(),
        product5_id,
        '782e0ec0-1760-401c-b2a5-300cb32d17b2',
        5,
        'This Ikat saree is a work of art! The patterns are so precise and the colors are vibrant yet subtle. It drapes beautifully and I received many compliments when I wore it. Knowing that it supports traditional artisans makes it even more special.',
        now() - interval '5 days'
    );
END $$;
-- Add sample cultural documentation entries
DO $$
DECLARE blue_pottery_id UUID;
banarasi_silk_id UUID;
admin_id UUID := 'bfa78a0e-8445-429a-a0f1-f0a081b16f94';
BEGIN -- Get craft IDs
SELECT id INTO blue_pottery_id
FROM crafts
WHERE name = 'Blue Pottery'
LIMIT 1;
SELECT id INTO banarasi_silk_id
FROM crafts
WHERE name = 'Banarasi Silk'
LIMIT 1;
-- Insert cultural documentation
INSERT INTO cultural_documentation (
        id,
        craft_id,
        title,
        content,
        contributor_id,
        is_verified,
        verified_by
    )
VALUES (
        uuid_generate_v4(),
        blue_pottery_id,
        'History of Blue Pottery in Jaipur',
        'Blue Pottery is widely recognized as a traditional craft of Jaipur, though it is Turko-Persian in origin. The name "blue pottery" comes from the eye-catching blue dye used to color the pottery, which is prepared from copper oxide and cobalt oxide.

The technique of making blue pottery was brought to Jaipur by Maharaja Sawai Ram Singh II (1835-1880) in the 19th century. He invited skilled artisans from Delhi to train local potters in the art. The distinctive blue-and-white pottery, made using Egyptian paste technique, gradually became a part of Jaipur''s identity.

Unlike conventional pottery, which uses clay, blue pottery in Jaipur is made from a mix of quartz stone, fuller''s earth, borax, gum, and water. The dough is then shaped into a product, dried, and painted with vibrant blue and white colors derived from oxide compounds. The designs are usually floral motifs, inspired by Persian and Mughal art.

The craft faced a decline in the early 20th century but was revived in the 1950s through the efforts of patrons like Maharani Gayatri Devi and craftsmen like Kripal Singh Shekhawat. Today, Jaipur Blue Pottery is internationally renowned and has a Geographical Indication (GI) tag.',
        admin_id,
        true,
        admin_id
    ),
    (
        uuid_generate_v4(),
        banarasi_silk_id,
        'The Art of Banarasi Silk Weaving',
        'Banarasi silk is a GI (Geographical Indication) protected product that has been woven in Varanasi, formerly known as Banaras, for centuries. The weaving of Banarasi silk sarees is a time-honored tradition that dates back to the Mughal era.

The primary characteristic of Banarasi silk is the use of gold and silver threads, known as zari, woven into intricate patterns alongside silk threads. These threads are traditionally pure gold or silver, though today most weavers use copper-coated threads to make the sarees more affordable.

The creation of a Banarasi silk saree involves multiple stages and artisans:
1. Design Creation: Highly skilled designers draw the patterns on graph paper, which will be translated into the jacquard punch cards.
2. Yarn Preparation: The silk is dyed, processed, and prepared for weaving.
3. Jacquard Setup: The design is converted into a series of punch cards that control the jacquard mechanism on the handloom.
4. Weaving: The actual weaving process takes anywhere from 15 days to 6 months, depending on the complexity of the design.

The patterns found in Banarasi silks typically include:
- Floral and foliate motifs
- Kalga (paisley) and bel (vine) patterns
- Jangla (jungle) scenes
- Butis (small motifs)
- Jaal (web-like) patterns

Traditional Banarasi sarees are categorized into several types:
- Katan: Made of pure silk
- Organza: Sheer and lightweight
- Tissue: Material with golden zari throughout
- Butidar: Featuring small woven motifs
- Jangla: Depicting dense foliage and floral patterns
- Tanchoi: With colorful weft patterns on a solid ground

Today, the Banarasi silk weaving community faces numerous challenges, including competition from power looms and synthetic substitutes. However, efforts are being made to preserve this intricate art form through government initiatives, design interventions, and market linkages.',
        admin_id,
        true,
        admin_id
    );
END $$;
-- Add sample stories for the homepage
DO $$
DECLARE pochampally_ikat_id UUID;
blue_pottery_id UUID;
BEGIN -- Get craft IDs
SELECT id INTO pochampally_ikat_id
FROM crafts
WHERE name = 'Pochampally Ikat'
LIMIT 1;
SELECT id INTO blue_pottery_id
FROM crafts
WHERE name = 'Blue Pottery'
LIMIT 1;
-- Insert stories
INSERT INTO stories (
        id,
        title,
        content,
        author_id,
        craft_id,
        is_featured
    )
VALUES (
        uuid_generate_v4(),
        'Preserving the Legacy of Pochampally Ikat',
        'When I was a young girl, I would watch my mother tie tiny knots on bundles of thread, preparing them for dyeing. This process, which seemed like magic to me then, is the essence of Ikat weaving - a resist-dyeing technique where patterns are created on the yarns before they are woven.

My journey with Pochampally Ikat began at the age of 12. My mother would set up a small loom for me beside hers, teaching me the basics of weaving while she worked on intricate designs. The rhythmic sound of the shuttle moving back and forth became the soundtrack of my childhood.

In our village, almost every household had a loom. During festivals, the narrow lanes would be adorned with colorful Ikat fabrics drying in the sun - a sight that tourists now travel miles to see. But behind this beautiful tradition lies years of practice and patience.

Creating a single Pochampally Ikat saree takes at least a week of focused work. The most intricate pieces can take a month or more. The precision required is immense - each thread must be dyed and placed exactly right for the pattern to emerge correctly during weaving.

Over the years, I have trained more than 50 women in our village, hoping to keep this tradition alive. Many of these women are now independent artisans who support their families through this craft. Seeing them achieve financial independence while preserving our heritage gives me immense pride.

The recognition of Pochampally Ikat with a GI tag in 2005 was a landmark moment for our community. It acknowledged centuries of craftsmanship and protected our unique techniques from imitation.

Today, as I teach my granddaughter the same techniques my mother taught me, I see the cycle of tradition continuing. Though we now incorporate modern designs alongside traditional patterns, the essence of Pochampally Ikat remains unchanged - a testament to the timeless beauty of handcrafted textiles.',
        'a39a3f9d-caa5-4745-9f64-697a6ca84d5f',
        pochampally_ikat_id,
        true
    ),
    (
        uuid_generate_v4(),
        'A Blue Legacy: Three Generations of Pottery',
        "My earliest memories are filled with the scent of clay and the sight of my grandfather's hands covered in blue dye. As a third-generation Blue Pottery artisan, my life has been shaped by this traditional craft that dates back centuries.

Blue Pottery is not just a livelihood for my family; it is our identity. My grandfather was among the artisans who worked with Kripal Singh Shekhawat during the 1950s revival of this art form in Jaipur. At a time when the craft was declining, they worked tirelessly to preserve and reinvigorate these ancient techniques.

What makes Blue Pottery unique is that it isn't made from clay like conventional pottery. We use a special dough made from quartz stone, fuller's earth, borax, gum, and water. This gives our pieces their characteristic strength and subtle translucency. The vibrant blue color comes from cobalt oxide, while other colors like turquoise, green, and yellow are created using different metal oxides.

Creating each piece is a methodical process. First, we prepare the dough and shape it using molds. The pieces are left to dry for several days before the first firing. Then comes the most meditative part of our work - painting. Using brushes made from squirrel hair, we apply intricate designs freehand. These designs are inspired by Persian motifs, but over generations, we've incorporated local elements like peacocks, elephants, and flowers native to Rajasthan.

The craft has faced many challenges over the years. Machine-made ceramics are cheaper and faster to produce. But what they lack is the soul that comes from the human touch - the slight variations that make each handcrafted piece unique.

When I received the Shilp Guru Award in 2018, it wasn't just a personal achievement but a recognition of our family's dedication to preserving this craft. Now, as I teach my son and daughter the same techniques, I'm hopeful for the future of Blue Pottery.

Through platforms like Artwork, we're reaching customers who value authenticity and traditional craftsmanship. Each piece we create carries not just beautiful designs but stories of cultural heritage and the legacy of generations of artisans who refused to let this beautiful craft disappear.",
        '3dc30111-a0e9-4bd4-b50d-1d2391b213de',
        blue_pottery_id,
        true
    );
END $;
-- Add comments to explain next steps and verification process
COMMENT ON TABLE profiles IS 'Important: The admin-uuid-placeholder and other UUID placeholders should be replaced with actual UUIDs from your auth system. For a demo, you may need to:
1. Sign up users through the application first
2. Get their UUIDs from auth.users table
3. Update these sample records with the correct UUIDs';
-- Verify data load
SELECT 'Regions count: ' || COUNT(*)
FROM regions;
SELECT 'Craft categories count: ' || COUNT(*)
FROM craft_categories;
SELECT 'Crafts count: ' || COUNT(*)
FROM crafts;
SELECT 'Products count: ' || COUNT(*)
FROM products;
SELECT 'Profiles count: ' || COUNT(*)
FROM profiles;