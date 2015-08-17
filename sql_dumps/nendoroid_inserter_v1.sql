/*
INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('',NULL,'','','',,,'',,'','','unboxed');

INSERT INTO nendoroid
(model_id,number)
VALUES
(LAST_INSERT_ID(),);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @nendoroid_id));
*/

SET @nendoroid_id := (SELECT id FROM category WHERE name LIKE 'nendoroid');

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Asuna',NULL,'Good Smile Company','None','Sword Art Online',2013,3333,'Japanese Yen',650,'Philippine Pesos','Comic Alley','unboxed');

INSERT INTO nendoroid
(model_id,number)
VALUES
(LAST_INSERT_ID(),283);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @nendoroid_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Kirito',NULL,'Good Smile Company','None','Sword Art Online',2013,3333,'Japanese Yen',650,'Philippine Pesos','Comic Alley','unboxed');

INSERT INTO nendoroid
(model_id,number)
VALUES
(LAST_INSERT_ID(),295);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @nendoroid_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Colossus Titan & Attack Playset',NULL,'Good Smile Company','None','Attack on Titan',2013,4571,'Japanese Yen',2300,'Philippine Pesos','Great Toys Online','boxed');

INSERT INTO nendoroid
(model_id,number)
VALUES
(LAST_INSERT_ID(),360);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @nendoroid_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Levi',NULL,'Good Smile Company','None','Attack on Titan',2014,3889,'Japanese Yen',1800,'Philippine Pesos','Great Toys Online','boxed');

INSERT INTO nendoroid
(model_id,number)
VALUES
(LAST_INSERT_ID(),390);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @nendoroid_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Eren Yeager',NULL,'Good Smile Company','None','Attack on Titan',2014,2704,'Japanese Yen',1800,'Philippine Pesos','Great Toys Online','unboxed');

INSERT INTO nendoroid
(model_id,number)
VALUES
(LAST_INSERT_ID(),375);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @nendoroid_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Rin Tohsaka',NULL,'Good Smile Company','None','Fate/stay night',2014,3611,'Japanese Yen',1800,'Philippine Pesos','Great Toys Online','unboxed');

INSERT INTO nendoroid
(model_id,number)
VALUES
(LAST_INSERT_ID(),409);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @nendoroid_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Solid Snake',NULL,'Good Smile Company','None','METAL GEAR SOLID',2015,4167,'Japanese Yen',1800,'Philippine Pesos','Great Toys Online','unboxed');

INSERT INTO nendoroid
(model_id,number)
VALUES
(LAST_INSERT_ID(),447);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @nendoroid_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Sinon',NULL,'Good Smile Company','None','Sword Art Online II',2014,3704,'Japanese Yen',1800,'Philippine Pesos','Great Toys Online','unboxed');

INSERT INTO nendoroid
(model_id,number)
VALUES
(LAST_INSERT_ID(),452);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @nendoroid_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Archer: Super Movable Edition',NULL,'Good Smile Company','None','Fate/stay night [Unlimited Blade Works]',2015,3426,'Japanese Yen',1800,'Philippine Pesos','Great Toys Online','unboxed');

INSERT INTO nendoroid
(model_id,number)
VALUES
(LAST_INSERT_ID(),486);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @nendoroid_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Rider',NULL,'Good Smile Company','None','Fate/stay night [Unlimited Blade Works]',2015,3704,'Japanese Yen',1800,'Philippine Pesos','Great Toys Online','unboxed');

INSERT INTO nendoroid
(model_id,number)
VALUES
(LAST_INSERT_ID(),492);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @nendoroid_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Darth Vader',NULL,'Good Smile Company','None','Star Wars Episode 4: A New Hope',2015,4444,'Japanese Yen',1800,'Philippine Pesos','Great Toys Online','unboxed');

INSERT INTO nendoroid
(model_id,number)
VALUES
(LAST_INSERT_ID(),502);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @nendoroid_id));
