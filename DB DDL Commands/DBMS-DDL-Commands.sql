-- Database: Ecommerce Store

CREATE DATABASE "Ecommerce Store"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  img VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL
);
	
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  size VARCHAR(255)[], 
  color VARCHAR(255)[],
  price DECIMAL(10, 2),
  in_stock INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  category_id INTEGER REFERENCES categories(id)
);

CREATE TABLE CategoryProduct (
  category_id INTEGER REFERENCES categories(id),
  product_id INTEGER REFERENCES products(id),
  PRIMARY KEY (category_id, product_id)
);

CREATE TABLE Cart (
    id SERIAL PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    products JSONB [] NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    isAdmin BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Orders (
  id SERIAL PRIMARY KEY,
  userId VARCHAR(255) NOT NULL,
  amount NUMERIC NOT NULL,
  address VARCHAR(1000),
  status VARCHAR(255) DEFAULT 'pending',
  products JSONB [] NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE OrderItem (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES Orders(id),
  product_id INTEGER REFERENCES products(id),
  users_id INTEGER REFERENCES Users(id)
);


CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
DECLARE
  product_record jsonb;
BEGIN
  -- Iterate through each product in the order
  FOR product_record IN SELECT * FROM unnest(CAST(NEW.products AS jsonb[]))
  LOOP
    -- Update the stock for the product in the products table
    UPDATE products
    SET in_stock = in_stock - 1
    WHERE id = (product_record->>'id')::INTEGER;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reduce_product_stock
AFTER INSERT ON Orders
FOR EACH ROW
EXECUTE FUNCTION update_product_stock();

-- Create a function to populate OrderItem table
CREATE OR REPLACE FUNCTION populate_order_item()
RETURNS TRIGGER AS $$
DECLARE
  product_record jsonb;
BEGIN
  -- Iterate through each product in the order
  FOR product_record IN SELECT * FROM unnest(CAST(NEW.products AS jsonb[]))
  LOOP
    -- Insert into OrderItem table
    INSERT INTO OrderItem (order_id, product_id, users_id)
    VALUES (NEW.id, (product_record->>'id')::INTEGER, NEW.userId::INTEGER);
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER populate_order_item_trigger
AFTER INSERT ON Orders
FOR EACH ROW
EXECUTE FUNCTION populate_order_item();

INSERT INTO categories (id, img, title) VALUES
  (1, 'https://images.unsplash.com/photo-1529720317453-c8da503f2051?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'SHIRT STYLE!'),
  (2, 'https://images.unsplash.com/photo-1499971856191-1a420a42b498?q=80&w=2658&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'SWEATSHIRTS LOVE'),
  (3, 'https://images.pexels.com/photos/6732388/pexels-photo-6732388.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'TROUSERS MANIA');

INSERT INTO products (id, title, description, image, size, color, price, in_stock, created_at, updated_at, category_id)
VALUES 
  (1, 'FLOWING MODAL BLEND SHIRT', 'Relaxed fit shirt in a modal blend. Spread collar and long sleeves with buttoned cuffs. Button-up front.', 'https://static.zara.net/photos///2023/I/0/2/p/0775/500/800/2/w/361/0775500800_2_4_1.jpg?ts=1693382632848', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black'], 225, 30, '2023-12-08 22:12:07.079319', '2023-12-08 22:12:07.079334', 1),
  (2, 'TEXTURED VISCOSE BLEND SHIRT', 'Relaxed fit shirt made of a viscose blend. Featuring a camp collar, short sleeves and a button-up front.', 'https://static.zara.net/photos///2024/V/0/2/p/7545/440/250/2/w/361/7545440250_1_1_1.jpg?ts=1701248442866', ARRAY['S', 'M', 'L', 'XL'], ARRAY['White'], 195, 45, '2023-12-08 22:12:07.079365', '2023-12-08 22:12:07.079368', 1),
  (3, '100% LINEN SHIRT', 'Regular fit shirt made of a linen fabric. Spread collar and long sleeves with buttoned cuffs. Button-up front.', 'https://static.zara.net/photos///2023/I/0/2/p/6359/010/400/2/w/361/6359010400_1_1_1.jpg?ts=1699444931308', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Blue'], 180, 20, '2023-12-08 22:12:07.079379', '2023-12-08 22:12:07.079380', 1),
  (4, 'STRIPED ELASTIC SHIRT', 'Slim fit shirt made of a fabric that minimises the need for ironing after washing. Spread collar and long sleeves with buttoned cuffs. Button-up front.', 'https://static.zara.net/photos///2023/I/0/2/p/6566/777/105/2/w/361/6566777105_1_1_1.jpg?ts=1694419331942', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Blue'], 210, 90, '2023-12-08 22:12:07.079403', '2023-12-08 22:12:07.079405', 1),
  (5, 'STRETCH SHIRT', 'Slim fit shirt made of a fabric that minimises the need for ironing after washing. Spread collar and long sleeves with buttoned cuffs. Button-up front.', 'https://static.zara.net/photos///2023/I/0/2/p/7545/423/800/2/w/361/7545423800_1_1_1.jpg?ts=1695029183468', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black'], 220, 50, '2023-12-08 22:12:07.079420', '2023-12-08 22:12:07.079422', 1),
  (6, 'CONTRAST PRINT SWEATSHIRT', 'Loose-fitting sweatshirt with a round neck and long sleeves. Contrast prints on the front and back. Ribbed trims.', 'https://static.zara.net/photos///2023/I/0/2/p/3665/319/800/2/w/361/3665319800_2_1_1.jpg?ts=1697557024548', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black'], 375, 30, '2023-12-08 22:12:07.079437', '2023-12-08 22:12:07.079439', 2),
  (7, 'ROUND NECK FADED SWEATSHIRT', 'Faded oversize sweatshirt featuring a round neckline, long sleeves and ribbed trims.', 'https://static.zara.net/photos///2024/V/0/2/p/2888/403/422/2/w/361/2888403422_6_1_1.jpg?ts=1701085147732', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Blue'], 340, 30, '2023-12-08 22:12:07.079449', '2023-12-08 22:12:07.079450', 2),
  (8, 'CREW NECK TRAINING SWEATSHIRT', 'Sweatshirt made of a cotton fabric. Featuring a round neckline, long sleeves, ribbed trims and an embroidered logo detail.', 'https://static.zara.net/photos///2023/I/0/2/p/0761/336/527/2/w/361/0761336527_2_1_1.jpg?ts=1701794450105', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Green'], 330, 50, '2023-12-08 22:12:07.079468', '2023-12-08 22:12:07.079470', 2),
  (9, 'TEXTURED SWEATSHIRT', 'Loose-fitting sweatshirt with a round neck and long sleeves.', 'https://static.zara.net/photos///2023/I/0/2/p/5039/810/251/2/w/361/5039810251_2_1_1.jpg?ts=1694769456552', ARRAY['S', 'M', 'L', 'XL'], ARRAY['White'], 300, 20, '2023-12-08 22:12:07.079480', '2023-12-08 22:12:07.079482', 2),
  (10, 'FAUX SHEARLING SWEATSHIRT WITH ZIP NECK', 'Long sleeve cropped sweatshirt featuring a high neck with front zip fastening. Ribbed trims.', 'https://static.zara.net/photos///2024/V/0/2/p/4853/400/922/2/w/361/4853400922_2_1_1.jpg?ts=1700647093947', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black'], 295, 30, '2023-12-08 22:12:07.079492', '2023-12-08 22:12:07.079493', 2),
  (11, 'PLEATED TROUSERS WITH DRAWSTRING', 'Straight-leg stretch cotton trousers. Waist with front pleats and adjustable drawstring. Front pockets and rear patch pockets with flaps. Front zip and button fastening.', 'https://static.zara.net/photos///2023/I/0/2/p/6861/323/700/2/w/361/6861323700_6_1_1.jpg?ts=1693554112250', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Brown'], 315, 25, '2023-12-08 22:12:07.079502', '2023-12-08 22:12:07.079504', 3),
  (12, 'CONTRAST TECHNICAL TROUSERS', 'Trousers made of lightweight and stretchy technical fabric.', 'https://static.zara.net/photos///2023/I/0/2/p/1732/319/807/2/w/361/1732319807_2_1_1.jpg?ts=1701794450524', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black'], 285, 50, '2023-12-08 22:12:07.079518', '2023-12-08 22:12:07.079520', 3),
  (13, 'JOGGER WAIST TROUSERS', 'Regular fit trousers. Elasticated waistband. Front pockets and buttoned welt back pockets. Front zip fly and top button fastening.', 'https://static.zara.net/photos///2023/I/0/2/p/8574/341/401/2/w/361/8574341401_2_1_1.jpg?ts=1688119947057', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Blue'], 270, 30, '2023-12-08 22:12:07.079528', '2023-12-08 22:12:07.079529', 3),
  (14, 'WIDE FIT CORDUROY TROUSERS', 'Wide-leg trousers. Front pleated details at the waist. Front pockets and rear pockets. Front zip fly and button fastening.', 'https://static.zara.net/photos///2024/V/0/2/p/4115/476/700/2/w/361/4115476700_6_1_1.jpg?ts=1701349793010', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Brown'], 340, 40, '2023-12-08 22:12:07.079539', '2023-12-08 22:12:07.079541', 3),
  (15, 'WIDE-LEG JEANS WITH BELT', 'Wide-leg jeans. Adjustable waist with a belt in matching fabric. Front pockets and back pockets. Front zip and button fastening.', 'https://static.zara.net/photos///2023/I/0/2/p/6186/300/251/2/w/361/6186300251_2_1_1.jpg?ts=1693988775925', ARRAY['S', 'M', 'L', 'XL'], ARRAY['White'], 305, 90, '2023-12-08 22:12:07.079557', '2023-12-08 22:12:07.079559', 3);

-- Backup

-- INSERT INTO products (id, title, description, image, size, color, price, in_stock, created_at, updated_at, category_id)
-- VALUES (1, 'FLOWING MODAL BLEND SHIRT', 'Relaxed fit shirt in a modal blend. Spread collar and long sleeves with buttoned cuffs. Button-up front.', 'https://static.zara.net/photos///2023/I/0/2/p/0775/500/800/2/w/361/0775500800_2_4_1.jpg?ts=1693382632848', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black'], 225, 30, '2023-12-08 22:12:07.079319', '2023-12-08 22:12:07.079334', 1);

-- INSERT INTO products (id, title, description, image, size, color, price, in_stock, created_at, updated_at, category_id)
-- VALUES (2, 'TEXTURED VISCOSE BLEND SHIRT', 'Relaxed fit shirt made of a viscose blend. Featuring a camp collar, short sleeves and a button-up front.', 'https://static.zara.net/photos///2024/V/0/2/p/7545/440/250/2/w/361/7545440250_1_1_1.jpg?ts=1701248442866', ARRAY['S', 'M', 'L', 'XL'], ARRAY['White'], 195, 45, '2023-12-08 22:12:07.079365', '2023-12-08 22:12:07.079368', 1);

-- INSERT INTO products (id, title, description, image, size, color, price, in_stock, created_at, updated_at, category_id)
-- VALUES (3, '100% LINEN SHIRT', 'Regular fit shirt made of a linen fabric. Spread collar and long sleeves with buttoned cuffs. Button-up front.', 'https://static.zara.net/photos///2023/I/0/2/p/6359/010/400/2/w/361/6359010400_1_1_1.jpg?ts=1699444931308', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Blue'], 180, 20, '2023-12-08 22:12:07.079379', '2023-12-08 22:12:07.079380', 1);

-- INSERT INTO products (id, title, description, image, size, color, price, in_stock, created_at, updated_at, category_id)
-- VALUES (4, 'STRIPED ELASTIC SHIRT', 'Slim fit shirt made of a fabric that minimises the need for ironing after washing. Spread collar and long sleeves with buttoned cuffs. Button-up front.', 'https://static.zara.net/photos///2023/I/0/2/p/6566/777/105/2/w/361/6566777105_1_1_1.jpg?ts=1694419331942', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Blue'], 210, 90, '2023-12-08 22:12:07.079403', '2023-12-08 22:12:07.079405', 1);

-- INSERT INTO products (id, title, description, image, size, color, price, in_stock, created_at, updated_at, category_id)
-- VALUES (5, 'STRETCH SHIRT', 'Slim fit shirt made of a fabric that minimises the need for ironing after washing. Spread collar and long sleeves with buttoned cuffs. Button-up front.', 'https://static.zara.net/photos///2023/I/0/2/p/7545/423/800/2/w/361/7545423800_1_1_1.jpg?ts=1695029183468', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black'], 220, 50, '2023-12-08 22:12:07.079420', '2023-12-08 22:12:07.079422', 1);

-- INSERT INTO products (id, title, description, image, size, color, price, in_stock, created_at, updated_at, category_id)
-- VALUES (6, 'CONTRAST PRINT SWEATSHIRT', 'Loose-fitting sweatshirt with a round neck and long sleeves. Contrast prints on the front and back. Ribbed trims.', 'https://static.zara.net/photos///2023/I/0/2/p/3665/319/800/2/w/361/3665319800_2_1_1.jpg?ts=1697557024548', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black'], 375, 30, '2023-12-08 22:12:07.079437', '2023-12-08 22:12:07.079439', 2);

-- INSERT INTO products (id, title, description, image, size, color, price, in_stock, created_at, updated_at, category_id)
-- VALUES (7, 'ROUND NECK FADED SWEATSHIRT', 'Faded oversize sweatshirt featuring a round neckline, long sleeves and ribbed trims.', 'https://static.zara.net/photos///2024/V/0/2/p/2888/403/422/2/w/361/2888403422_6_1_1.jpg?ts=1701085147732', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Blue'], 340, 30, '2023-12-08 22:12:07.079449', '2023-12-08 22:12:07.079450', 2);

-- INSERT INTO products (id, title, description, image, size, color, price, in_stock, created_at, updated_at, category_id)
-- VALUES (8, 'CREW NECK TRAINING SWEATSHIRT', 'Sweatshirt made of a cotton fabric. Featuring a round neckline, long sleeves, ribbed trims and an embroidered logo detail.', 'https://static.zara.net/photos///2023/I/0/2/p/0761/336/527/2/w/361/0761336527_2_1_1.jpg?ts=1701794450105', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Green'], 330, 50, '2023-12-08 22:12:07.079468', '2023-12-08 22:12:07.079470', 2);

-- INSERT INTO products (id, title, description, image, size, color, price, in_stock, created_at, updated_at, category_id)
-- VALUES (9, 'TEXTURED SWEATSHIRT', 'Loose-fitting sweatshirt with a round neck and long sleeves.', 'https://static.zara.net/photos///2023/I/0/2/p/5039/810/251/2/w/361/5039810251_2_1_1.jpg?ts=1694769456552', ARRAY['S', 'M', 'L', 'XL'], ARRAY['White'], 300, 20, '2023-12-08 22:12:07.079480', '2023-12-08 22:12:07.079482', 2);

-- INSERT INTO products (id, title, description, image, size, color, price, in_stock, created_at, updated_at, category_id)
-- VALUES (10, 'FAUX SHEARLING SWEATSHIRT WITH ZIP NECK', 'Long sleeve cropped sweatshirt featuring a high neck with front zip fastening. Ribbed trims.', 'https://static.zara.net/photos///2024/V/0/2/p/4853/400/922/2/w/361/4853400922_2_1_1.jpg?ts=1700647093947', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black'], 295, 30, '2023-12-08 22:12:07.079492', '2023-12-08 22:12:07.079493', 2);

-- INSERT INTO products (id, title, description, image, size, color, price, in_stock, created_at, updated_at, category_id)
-- VALUES (11, 'PLEATED TROUSERS WITH DRAWSTRING', 'Straight-leg stretch cotton trousers. Waist with front pleats and adjustable drawstring. Front pockets and rear patch pockets with flaps. Front zip and button fastening.', 'https://static.zara.net/photos///2023/I/0/2/p/6861/323/700/2/w/361/6861323700_6_1_1.jpg?ts=1693554112250', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Brown'], 315, 25, '2023-12-08 22:12:07.079502', '2023-12-08 22:12:07.079504', 3);

-- INSERT INTO products (id, title, description, image, size, color, price, in_stock, created_at, updated_at, category_id)
-- VALUES (12, 'CONTRAST TECHNICAL TROUSERS', 'Trousers made of lightweight and stretchy technical fabric.', 'https://static.zara.net/photos///2023/I/0/2/p/1732/319/807/2/w/361/1732319807_2_1_1.jpg?ts=1701794450524', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black'], 285, 50, '2023-12-08 22:12:07.079518', '2023-12-08 22:12:07.079520', 3);

-- INSERT INTO products (id, title, description, image, size, color, price, in_stock, created_at, updated_at, category_id)
-- VALUES (13, 'JOGGER WAIST TROUSERS', 'Regular fit trousers. Elasticated waistband. Front pockets and buttoned welt back pockets. Front zip fly and top button fastening.', 'https://static.zara.net/photos///2023/I/0/2/p/8574/341/401/2/w/361/8574341401_2_1_1.jpg?ts=1688119947057', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Blue'], 270, 30, '2023-12-08 22:12:07.079528', '2023-12-08 22:12:07.079529', 3);

-- INSERT INTO products (id, title, description, image, size, color, price, in_stock, created_at, updated_at, category_id)
-- VALUES (14, 'WIDE FIT CORDUROY TROUSERS', 'Wide-leg trousers. Front pleated details at the waist. Front pockets and rear pockets. Front zip fly and button fastening.', 'https://static.zara.net/photos///2024/V/0/2/p/4115/476/700/2/w/361/4115476700_6_1_1.jpg?ts=1701349793010', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Brown'], 340, 40, '2023-12-08 22:12:07.079539', '2023-12-08 22:12:07.079541', 3);

-- INSERT INTO products (id, title, description, image, size, color, price, in_stock, created_at, updated_at, category_id)
-- VALUES (15, 'WIDE-LEG JEANS WITH BELT', 'Wide-leg jeans. Adjustable waist with a belt in matching fabric. Front pockets and back pockets. Front zip and button fastening.', 'https://static.zara.net/photos///2023/I/0/2/p/6186/300/251/2/w/361/6186300251_2_1_1.jpg?ts=1693988775925', ARRAY['S', 'M', 'L', 'XL'], ARRAY['White'], 305, 90, '2023-12-08 22:12:07.079557', '2023-12-08 22:12:07.079559', 3);
