
/*
INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('',NULL,'','','',,,'',,'','','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'','',,,'');
*/

SET @gundam_id := (SELECT id FROM category WHERE name LIKE 'gundam');

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Build Booster',NULL,'Bandai','1/144','Gundam Build Fighters',2013,500,'Japanese Yen',300,'Philippine Pesos','Zero Four Gundam','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'HG','Build Custom',1,NULL,'Build Strike Gundam Support Unit');

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Build Booster Mk-II',NULL,'Bandai','1/144','Gundam Build Fighters',2013,600,'Japanese Yen',450,'Philippine Pesos','SM Department Store','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'HG','Build Custom',3,NULL,'Build Gundam Mk-II Support Unit');

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Amazing Weapon Binder',NULL,'Bandai','1/144','Gundam Build Fighters',2014,500,'Japanese Yen',350,'Philippine Pesos','SM Department Store','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'HG','Build Custom',7,NULL,'Build Fighters Support Weapon');

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Dark Matter Booster',NULL,'Bandai','1/144','Gundam Build Fighters',2014,600,'Japanese Yen',320,'Philippine Pesos','Zero Four Gundam','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'HG','Build Custom',11,NULL,'Gundam Exia Dark Matter Support Unit');

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Wing Gundam Fenice',NULL,'Bandai','1/144','Gundam Build Fighters',2013,1600,'Japanese Yen',1200,'Philippine Pesos','Toy Kingdom','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'HG','Build Fighters',6,'XXXG-01Wf','Build Fighter Ricardo Fellini Custom Made Mobile Suit');

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Star Build Strike Plavsky Wing',NULL,'Bandai','1/144','Gundam Build Fighters',2014,1500,'Japanese Yen',1200,'Philippine Pesos','Toy Kingdom','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'HG','Build Fighters',9,'GAT-X105B/ST','Build Fighter Sei Iori Custom Made Mobile Suit');

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Gundam Exia Dark Matter',NULL,'Bandai','1/144','Gundam Build Fighters',2014,1800,'Japanese Yen',950,'Philippine Pesos','Zero Four Gundam','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'HG','Build Fighters',13,'PPGN-001','PPSE Works Custom Made Mobile Suit');

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Gundam Amazing Exia',NULL,'Bandai','1/144','Gundam Build Fighters',2014,1800,'Japanese Yen',950,'Philippine Pesos','Toy Builders','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'HG','Build Fighters',16,'PPGN-001','PPSE Works Meijin Kawaguchi Custom Made Mobile Suit');

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Beargguy F',NULL,'Bandai','1/144','Gundam Build Fighters TRY',2014,1800,'Japanese Yen',1050,'Philippine Pesos','SM Department Store','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'HG','Build Fighters',22,'KUMA-F','Mirai Kamiki''s Mobile Suit');

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Gundam Throne Eins',NULL,'Bandai','1/144','Mobile Suit Gundam 00',2008,1600,'Japanese Yen',1000,'Philippine Pesos','SM Department Store','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'HG','Gundam 00',9,'GNW-001',NULL);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Gundam Throne Drei',NULL,'Bandai','1/144','Mobile Suit Gundam 00',2008,1600,'Japanese Yen',1000,'Philippine Pesos','Toys R'' Us','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'HG','Gundam 00',14,'GNW-003',NULL);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Cherudim Gundam',NULL,'Bandai','1/144','Mobile Suit Gundam 00',2008,1200,'Japanese Yen',750,'Philippine Pesos','SM Department Store','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'HG','Gundam 00',24,'GN-006',NULL);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Arios Gundam',NULL,'Bandai','1/144','Mobile Suit Gundam 00',2008,1500,'Japanese Yen',1000,'Philippine Pesos','Toy Kingdom','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'HG','Gundam 00',28,'GN-007',NULL);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('GN Archer',NULL,'Bandai','1/144','Mobile Suit Gundam 00',2009,1200,'Japanese Yen',800,'Philippine Pesos','Toy Kingdom','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'HG','Gundam 00',29,'GNR-101A',NULL);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Gadessa',NULL,'Bandai','1/144','Mobile Suit Gundam 00',2009,1500,'Japanese Yen',1000,'Philippine Pesos','Toy Kingdom','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'HG','Gundam 00',30,'GNZ-003',NULL);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Arche Gundam',NULL,'Bandai','1/144','Mobile Suit Gundam 00',2009,1600,'Japanese Yen',1100,'Philippine Pesos','Toy Kingdom','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'HG','Gundam 00',43,'GNW-2000',NULL);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Susanowo',NULL,'Bandai','1/144','Mobile Suit Gundam 00',2009,1500,'Japanese Yen',1000,'Philippine Pesos','Toy Kingdom','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'HG','Gundam 00',46,'GNX-Y901TW',NULL);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('00 Raiser + GN Sword III',NULL,'Bandai','1/144','Mobile Suit Gundam 00',2009,2000,'Japanese Yen',1300,'Philippine Pesos','Toys R'' Us','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'HG','Gundam 00',54,'GN-0000 + GNR-010',NULL);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Reborns Gundam (Trans-Am mode)',NULL,'Bandai','1/144','Mobile Suit Gundam 00',2010,1800,'Japanese Yen',1300,'Philippine Pesos','SM Department Store','broken');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'HG','Gundam 00',60,'GN-0000G/C',NULL);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('00 QAN[t]',NULL,'Bandai','1/144','Mobile Suit Gundam 00 Awakening of the Trailblazer',2010,1600,'Japanese Yen',1000,'Philippine Pesos','Great Toys Online','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'HG','Gundam 00',66,'GNT-0000',NULL);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Gundam Zabanya',NULL,'Bandai','1/144','Mobile Suit Gundam 00 Awakening of the Trailblazer',2010,1800,'Japanese Yen',0,NULL,NULL,'unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'HG','Gundam 00',67,'GN-010',NULL);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Gundam Harute',NULL,'Bandai','1/144','Mobile Suit Gundam 00 Awakening of the Trailblazer',2010,1800,'Japanese Yen',1080,'Philippine Pesos','Great Toys Online','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'HG','Gundam 00',68,'GN-011',NULL);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Raphael Gundam',NULL,'Bandai','1/144','Mobile Suit Gundam 00 Awakening of the Trailblazer',2010,2000,'Japanese Yen',1300,'Philippine Pesos','Great Toys Online','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'HG','Gundam 00',69,'CB-002',NULL);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Sword Impulse Gundam',NULL,'Bandai','1/144','Mobile Suit Gundam Seed Destiny',2005,1500,'Japanese Yen',880,'Philippine Pesos','Great Toys Online','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'HG','Gundam Seed',21,'ZGMF-X56S/beta',NULL);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Infinite Justice Gundam',NULL,'Bandai','1/144','Mobile Suit Gundam Seed Destiny',2005,1600,'Japanese Yen',1000,'Philippine Pesos','Robinson''s Department Store','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'HG','Gundam Seed',32,'ZGMF-X19A',NULL);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Strike Freedom Gundam',NULL,'Bandai','1/144','Mobile Suit Gundam Seed Destiny',2005,1600,'Japanese Yen',1000,'Philippine Pesos','Toy Kingdom','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'HG','Gundam Seed',34,'ZGMF-X20A',NULL);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Destiny Gundam',NULL,'Bandai','1/144','Mobile Suit Gundam Seed Destiny',2005,1600,'Japanese Yen',0,NULL,NULL,'unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'HG','Gundam Seed',36,'ZGMF-X42S',NULL);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Strike Noir Gundam',NULL,'Bandai','1/144','Mobile Suit Gundam Seed Stargazer',2006,1500,'Japanese Yen',880,'Philippine Pesos','Great Toys Online','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'HG','Gundam Seed',41,'GAT-X105E',NULL);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Duel Gundam Assault Shroud',NULL,'Bandai','1/144','Mobile Suit Gundam Seed',2011,1200,'Japanese Yen',1000,'Philippine Pesos','SM Department Store','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'HG','Gundam Seed Remaster',2,'GAT-X102',NULL);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Unicorn Gundam (Destroy Mode)',NULL,'Bandai','1/144','Mobile Suit Gundam Unicorn',2009,1800,'Japanese Yen',1200,'Philippine Pesos','Toy Kingdom','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'HG','Universal Century',100,'RX-0','Full Psycho Frame Prototype Mobile Suit');

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Unicorn Gundam 02 Banshee (Destroy Mode)',NULL,'Bandai','1/144','Mobile Suit Gundam Unicorn',2011,1800,'Japanese Yen',1200,'Philippine Pesos','Great Toys Online','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'HG','Universal Century',134,'RX-0','Full Psycho Frame Prototype Mobile Suit');

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('G Gundam',NULL,'Bandai','1/100','Mobile Fighter G Gundam',2010,2500,'Japanese Yen',1500,'Philippine Pesos','Great Toys Online','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'MG','Fighting Action',NULL,'GF13-017NJII','Neo Japan Mobile Fighter');

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Destiny Gundam Extreme Blast Mode',NULL,'Bandai','1/100','Mobile Suit Gundam Seed Destiny',2007,7000,'Japanese Yen',3200,'Philippine Pesos','I Love Omocha','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'MG','Gundam Seed',NULL,'ZGMF-X42S','Z.A.F.T. Mobile Suit');

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Strike Freedom Gundam Full Burst Mode',NULL,'Bandai','1/100','Mobile Suit Gundam Seed Destiny',2006,7000,'Japanese Yen',3200,'Philippine Pesos','I Love Omocha','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'MG','Gundam Seed',NULL,'ZGMF-X20A','Z.A.F.T. Mobile Suit');

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Strike Noir Gundam',NULL,'Bandai','1/100','Mobile Suit Gundam Seed Stargazer',2010,4500,'Japanese Yen',2700,'Philippine Pesos','Great Toys Online','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'MG','Gundam Seed',NULL,'GAT-X105E','O.M.N.I. Enforcer Mobile Suit');

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Force Impulse Gundam',NULL,'Bandai','1/100','Mobile Suit Gundam Seed Destiny',2008,4500,'Japanese Yen',3000,'Philippine Pesos','Special Toy Center','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'MG','Gundam Seed',NULL,'ZGMF-X56S/alpha','Z.A.F.T. Mobile Suit');

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Nu Gundam',NULL,'Bandai','1/100','Mobile Suit Gundam Char''s Counterattack',2012,7000,'Japanese Yen',3750,'Philippine Pesos','Zero Four Gundam','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'MG','Ver Ka.',NULL,'RX-93','Amuro Ray''s Customize Mobile Suit for Newtype');

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Unicorn Gundam 02 Banshee',NULL,'Bandai','1/100','Mobile Suit Gundam Unicorn',2012,5500,'Japanese Yen',3450,'Philippine Pesos','Great Toys Online','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'MG',NULL,NULL,'RX-0','Full Psycho Frame Prototype Mobile Suit');

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Gundam',NULL,'Bandai','1/144','Mobile Suit Gundam 0079',2010,2500,'Japanese Yen',1250,'Philippine Pesos','Great Toys Online','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'RG','RG',1,'RX-78-2','E.F.S.F. Prototype Close-Combat Mobile Suit');

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Strike Gundam',NULL,'Bandai','None','Mobile Suit Gundam Seed',2003,750,'Japanese Yen',450,'Philippine Pesos','Great Toys Online','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'SD','BB Senshi',246,'GAT-X105',NULL);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Force Impulse Gundam',NULL,'Bandai','None','Mobile Suit Gundam Seed Destiny',2005,750,'Japanese Yen',450,'Philippine Pesos','Great Toys Online','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'SD','BB Senshi',280,'ZGMF-X56S/alpha',NULL);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Gundam Exia Repair II',NULL,'Bandai','None','Mobile Suit Gundam 00',2009,600,'Japanese Yen',0,NULL,NULL,'unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'SD','BB Senshi',334,'GN-001REII',NULL);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Unicorn Gundam',NULL,'Bandai','None','Mobile Suit Gundam Unicorn',2010,1000,'Japanese Yen',700,'Philippine Pesos','Great Toys Online','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'SD','BB Senshi',360,'RX-0',NULL);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Sazabi',NULL,'Bandai','None','Mobile Suit Gundam Char''s Counterattack',2013,1000,'Japanese Yen',800,'Philippine Pesos','SM Department Store','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'SD','BB Senshi',382,'MSN-04',NULL);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Hi-Nu Gundam',NULL,'Bandai','None','Mobile Suit Gundam Char''s Counterattack',2013,1200,'Japanese Yen',950,'Philippine Pesos','SM Department Store','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'SD','BB Senshi',384,'RX-93-v2',NULL);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Xi Gundam',NULL,'Bandai','None','Mobile Suit Gundam Hathaway''s Flash',2013,1500,'Japanese Yen',1100,'Philippine Pesos','SM Department Store','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'SD','BB Senshi',386,'RX-105',NULL);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Neo Zeong',NULL,'Bandai','None','Mobile Suit Gundam Unicorn',2014,2000,'Japanese Yen',1300,'Philippine Pesos','Toy Builders','unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'SD','BB Senshi',392,'NZ-999',NULL);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('Wing Gundam 0',NULL,'Bandai','None','Mobile Suit Gundam Wing',2000,500,'Japanese Yen',0,NULL,NULL,'unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'SD','G Generation F',41,'XXXG-00W0',NULL);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));

INSERT INTO model 
(name,description,manufacturer,scale,series,year_of_release,cover_price,cover_price_currency,selling_price,selling_price_currency,store,status)
VALUES
('G Gundam',NULL,'Bandai','None','Mobile Fighter G Gundam',2002,750,'Japanese Yen',0,NULL,NULL,'unboxed');

INSERT INTO gundam
(model_id,grade,gundam_series,gundam_series_number,gundam_model_number,subtitle)
VALUES
(LAST_INSERT_ID(),'SD','G Generation BB',242,'GF13-01NJII',NULL);

INSERT INTO model_has_category
(model_id,category_id)
VALUES
(LAST_INSERT_ID(),(SELECT @gundam_id));
