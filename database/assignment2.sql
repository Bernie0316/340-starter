--- TASK 1 ---
--1-3 Tony Stark --
select * from account

INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
	values ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n')

UPDATE account
    SET account_type = 'Admin'
	WHERE account_firstname = 'Tony' AND account_lastname = 'Stark'

DELETE from account
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark'

--4 GM Hummer --
select * from inventory
where inv_id = 10

UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interiors')
WHERE inv_make = 'GM' AND inv_model = 'Hummer'

--5 inner join --
select * from inventory
select * from classification
select inv_make, inv_model, classification_name FROM inventory i
	JOIN classification c 
		ON c.classification_id = i.classification_id
WHERE c.classification_name = 'SPORT';

--6 add "/vehicles" --
-- select * from inventory
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');

--7 sql step 4, 6--
select * from inventory
where inv_id = 10
select * from inventory

--- TASK 2 ---
