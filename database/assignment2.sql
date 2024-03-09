--
-- Database: 'cse 340 project', .public schema
-- Assignment W02
--

INSERT INTO public.account (
	account_firstname,
	account_lastname,
	account_email,
	account_password
)
VALUES (
	'Tony',
	'Stark',
	'tony@starkent.com',
	'Iam1ronM@n'
);

UPDATE public.account SET account_type = 'Admin';
DELETE FROM public.account
WHERE account_firstname = 'Tony'
	AND account_lastname = 'Stark';
-- Alternative:
-- DELETE FROM public.account WHERE account_id = 1;

-- W02 QUERY 4
UPDATE
    public.inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE
    inv_id = 10;

-- W02 QUERY 5: inner join practice
SELECT
    inv_make,
    inv_model,
	classification_name
FROM 
    inventory
INNER JOIN classification
	ON inventory.classification_id = classification.classification_id
WHERE
	classification_name = 'Sport';

-- W02 QUERY 6
UPDATE
    public.inventory
SET
    inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');