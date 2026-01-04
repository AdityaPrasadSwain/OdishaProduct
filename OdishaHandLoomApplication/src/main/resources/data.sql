-- Seed Categories for Udrakala Master Catalog
-- Handloom Categories
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Cotton Sarees', 'HL-SAR-001', 'Handloom Cotton Sarees', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Silk Sarees', 'HL-SAR-002', 'Handloom Silk Sarees', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Sambalpuri Ikat Sarees', 'HL-SAR-003', 'Sambalpuri Ikat', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Bomkai Sarees', 'HL-SAR-004', 'Bomkai Silk & Cotton', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Tussar Sarees', 'HL-SAR-005', 'Tussar Silk', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Linen Sarees', 'HL-SAR-006', 'Handwoven Linen', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Khadi Sarees', 'HL-SAR-007', 'Khadi', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Banarasi Style Sarees', 'HL-SAR-008', 'Banarasi Style', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Plain & Daily Wear Sarees', 'HL-SAR-009', 'Daily Wear', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Party & Wedding Sarees', 'HL-SAR-010', 'Party Wear', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Printed Sarees', 'HL-SAR-011', 'Printed Handloom', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Hand-embroidered Sarees', 'HL-SAR-012', 'Embroidered', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'GI-Tag Sarees', 'HL-SAR-013', 'GI Tagged', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Premium Heritage Collection', 'HL-SAR-014', 'Heritage', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Cotton Dupattas', 'HL-DUP-001', 'Cotton Dupattas', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Silk Dupattas', 'HL-DUP-002', 'Silk Dupattas', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Ikat Dupattas', 'HL-DUP-003', 'Ikat Dupattas', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Cotton Stoles', 'HL-STO-001', 'Cotton Stoles', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Woolen Stoles', 'HL-STO-002', 'Woolen Stoles', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Silk Stoles', 'HL-STO-003', 'Silk Stoles', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Cotton Fabric', 'HL-FAB-001', 'Cotton Fabric', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Silk Fabric', 'HL-FAB-002', 'Silk Fabric', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Ikat Fabric', 'HL-FAB-003', 'Ikat Fabric', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Men’s Cotton Kurtas', 'HL-KUR-001', 'Mens Cotton Kurtas', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Men’s Silk Kurtas', 'HL-KUR-002', 'Mens Silk Kurtas', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Ikat Pattern Kurtas', 'HL-KUR-003', 'Ikat Kurtas', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Cotton Dress Material Sets', 'HL-DM-001', 'Cotton DM', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Silk Dress Material Sets', 'HL-DM-002', 'Silk DM', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Ready-Made Blouses', 'HL-BLO-001', 'Ready Made Blouses', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Handloom Blouses', 'HL-BLO-002', 'Handloom Blouses', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Woolen Shawls', 'HL-SHW-001', 'Woolen Shawls', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Pashmina Style Shawls', 'HL-SHW-002', 'Pashmina', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- Handicraft Categories
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Handcrafted Lamps', 'HC-HDC-001', 'Lamps', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Candle Holders', 'HC-HDC-002', 'Candle Holders', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Decorative Baskets', 'HC-HDC-003', 'Baskets', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Fabric Wall Hangings', 'HC-WHG-001', 'Fabric Wall Hangings', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Tribal Wall Art', 'HC-WHG-002', 'Tribal Art', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Terracotta Pots', 'HC-TER-001', 'Terracotta Pots', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Planters', 'HC-TER-002', 'Planters', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Figurines', 'HC-TER-003', 'Figurines', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Stone Idols', 'HC-STN-001', 'Stone Idols', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Decorative Sculptures', 'HC-STN-002', 'Sculptures', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Wooden Carvings', 'HC-WOD-001', 'Wooden Carvings', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Decorative Boxes', 'HC-WOD-002', 'Boxes', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Brass Idols', 'HC-MET-001', 'Brass Idols', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Copper Decor', 'HC-MET-002', 'Copper Decor', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Dokra Art', 'HC-TRB-001', 'Dokra', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Tribal Masks', 'HC-TRB-002', 'Masks', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Tribal Jewelry', 'HC-JWL-001', 'Tribal Jewelry', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Terracotta Jewelry', 'HC-JWL-002', 'Terracotta Jewelry', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Festival Gift Hampers', 'HC-GFT-001', 'Gift Hampers', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Handmade Souvenirs', 'HC-GFT-002', 'Souvenirs', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Coconut Husk Planters', 'HC-COC-001', 'Husk Planters', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO categories (id, name, category_code, description, active) VALUES (gen_random_uuid(), 'Coconut Shell Bowls', 'HC-COC-002', 'Shell Bowls', true) ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;


