/*
INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('',NULL,'','','',,,'',,'','','unboxed');

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @other_id));
*/

SET @other_id := (SELECT id FROM category WHERE name LIKE 'other');

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Aerith Gainsborough - Play Arts',NULL,'Kotobukiya/Square Enix','None','Final Fantasy VII',2008,3800,'Japanese Yen',2000,'Philippine Pesos','Great Toys Online','unboxed');

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @other_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Cloud Strife - Kingdom Hearts Play Arts Vol. 2',NULL,'Kotobukiya/Square Enix','None','Kingdom Hearts',2010,3800,'Japanese Yen',2000,'Philippine Pesos','Great Toys Online','unboxed');

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @other_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Gabranth - Play Arts Kai',NULL,'Square Enix','None','Dissidia Final Fantasy',2011,4800,'Japanese Yen',2500,'Philippine Pesos','Great Toys Online','unboxed');

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @other_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Tina Branford - Trading Arts Vol. 2',NULL,'Square Enix','None','Dissidia Final Fantasy',2011,880,'Japanese Yen',500,'Philippine Pesos','Great Toys Online','unboxed');

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @other_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Ashelia B''nargin Dalmasca (Ashe) - Play Arts ',NULL,'Kotobukiya/Square Enix','None','Final Fantasy XII',2007,3990,'Japanese Yen',2000,'Philippine Pesos','Great Toys Online','unboxed');

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @other_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Cloud Strife',NULL,'Kotobukiya/Square Enix','None','Final Fantasy VII',2007,3990,'Japanese Yen',2000,'Philippine Pesos','Great Toys Online','unboxed');

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @other_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Squall Leonheart',NULL,'Kotobukiya/Square Enix','None','Dissidia Final Fantasy',2011,4800,'Japanese Yen',2500,'Philippine Pesos','Great Toys Online','unboxed');

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @other_id));