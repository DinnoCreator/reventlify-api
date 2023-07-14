CREATE DATABASE reventlify;
CREATE TABLE company (
    company_id TEXT NOT NULL UNIQUE,
    company_name TEXT NOT NULL UNIQUE,
    company_email TEXT NOT NULL UNIQUE,
    company_address TEXT,
    company_city TEXT,
    company_state TEXT,
    company_country TEXT,
    company_password TEXT NOT NULL,
    company_logo TEXT,
    company_logo_id TEXT,
    company_accbal NUMERIC(17, 2) NOT NULL,
    theatre_percentage NUMERIC(17, 2) NOT NULL,
    concert_percentage NUMERIC(17, 2) NOT NULL,
    service_percentage NUMERIC(17, 2) NOT NULL,
    conference_percentage NUMERIC(17, 2) NOT NULL,
    pageantry_percentage NUMERIC(17, 2) NOT NULL,
    education_percentage NUMERIC(17, 2) NOT NULL,
    carnival_percentage NUMERIC(17, 2) NOT NULL,
    festival_percentage NUMERIC(17, 2) NOT NULL,
    party_percentage NUMERIC(17, 2) NOT NULL,
    sport_percentage NUMERIC(17, 2) NOT NULL,
    talentshow_percentage NUMERIC(17, 2) NOT NULL,
    c_date DATE NOT NULL,
    c_time TIME NOT NULL
);
CREATE TABLE clients (
    client_id TEXT NOT NULL UNIQUE,
    client_email TEXT NOT NULL UNIQUE,
    client_name TEXT NOT NULL,
    client_address TEXT,
    client_phone TEXT,
    client_city TEXT,
    client_state TEXT,
    client_country TEXT,
    client_password TEXT NOT NULL,
    client_gender TEXT,
    client_photo TEXT,
    client_photo_id TEXT,
    client_accbal NUMERIC(17, 2) NOT NULL,
    c_date DATE NOT NULL,
    c_time TIME NOT NULL
);
CREATE TABLE limbo (
    client_email TEXT NOT NULL UNIQUE,
    client_verify TEXT,
    client_status TEXT NOT NULL,
    c_date DATE NOT NULL,
    c_time TIME NOT NULL
);
CREATE TABLE regimes (
    regime_id TEXT NOT NULL UNIQUE,
    creator_id TEXT NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE ON UPDATE CASCADE,
    regime_name TEXT NOT NULL UNIQUE,
    regime_address TEXT NOT NULL,
    regime_city TEXT NOT NULL,
    regime_state TEXT NOT NULL,
    regime_country TEXT NOT NULL,
    regime_withdrawal_pin TEXT NOT NULL,
    regime_type TEXT NOT NULL,
    regime_description TEXT,
    regime_media TEXT NOT NULL,
    regime_media_id TEXT NOT NULL,
    regime_accbal NUMERIC(17, 2) NOT NULL,
    regime_affiliate TEXT NOT NULL,
    regime_status TEXT NOT NULL,
    regime_start_date DATE NOT NULL,
    regime_start_time TIME NOT NULL,
    regime_end_date DATE NOT NULL,
    regime_end_time TIME NOT NULL,
    c_date DATE NOT NULL,
    c_time TIME NOT NULL
);
CREATE TABLE regime_roles (
    participant_id TEXT NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE ON UPDATE CASCADE,
    regime_id TEXT NOT NULL REFERENCES regimes(regime_id) ON DELETE CASCADE ON UPDATE CASCADE,
    regime_role TEXT NOT NULL 
)
CREATE TABLE pricings (
    pricing_id TEXT NOT NULL UNIQUE,
    regime_id TEXT NOT NULL REFERENCES regimes(regime_id) ON DELETE CASCADE ON UPDATE CASCADE,
    pricing_name TEXT NOT NULL,
    pricing_total_seats NUMERIC(17, 2) NOT NULL,
    pricing_available_seats NUMERIC(17, 2) NOT NULL,
    pricing_amount NUMERIC(17, 2) NOT NULL,
    pricing_affiliate_amount NUMERIC(17, 2),
    c_date DATE NOT NULL,
    c_time TIME NOT NULL
);
CREATE TABLE affiliates (
    affiliate_id TEXT NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE ON UPDATE CASCADE,
    regime_id TEXT NOT NULL REFERENCES regimes(regime_id) ON DELETE CASCADE ON UPDATE CASCADE,
    affiliate_accbal NUMERIC(17, 2) NOT NULL,
    c_date DATE NOT NULL,
    c_time TIME NOT NULL
);
CREATE TABLE tickets (
    ticket_id TEXT NOT NULL UNIQUE,
    pricing_id TEXT NOT NULL REFERENCES pricings(pricing_id) ON DELETE CASCADE ON UPDATE CASCADE,
    transaction_id TEXT NOT NULL REFERENCES transactions(transaction_id) ON DELETE CASCADE ON UPDATE CASCADE,
    ticket_buyer_id TEXT NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE ON UPDATE CASCADE,
    ticket_owner_id TEXT NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE ON UPDATE CASCADE,
    ticket_amount NUMERIC(17, 2) NOT NULL,
    ticket_status TEXT NOT NULL,
    affiliate_id TEXT REFERENCES clients(client_id) ON DELETE CASCADE ON UPDATE CASCADE,
    c_date DATE NOT NULL,
    c_time TIME NOT NULL
);
CREATE TABLE preference (
    owner_id TEXT NOT NULL UNIQUE REFERENCES clients(client_id) ON DELETE CASCADE ON UPDATE CASCADE,
    preference_one TEXT NOT NULL,
    preference_two TEXT NOT NULL,
    preference_three TEXT NOT NULL,
    edit_date DATE NOT NULL,
    edit_time TIME NOT NULL, c_date DATE NOT NULL,
    c_time TIME NOT NULL
);
CREATE TABLE transactions (
    transaction_id TEXT NOT NULL UNIQUE, 
    transaction_type TEXT NOT NULL, 
    client_id TEXT NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE ON UPDATE CASCADE,
    regime_id TEXT NOT NULL REFERENCES regimes(regime_id) ON DELETE CASCADE ON UPDATE CASCADE,
    pricing_id TEXT NOT NULL REFERENCES pricings(pricing_id) ON DELETE CASCADE ON UPDATE CASCADE,
    reference_number TEXT NOT NULL,
    amount NUMERIC(17, 2) NOT NULL,
    transaction_status TEXT NOT NULL,
    transaction_description TEXT NOT NULL,
    transaction_date DATE NOT NULL,
    transaction_time TIME NOT NULL
);
select *
from company;
select *
from clients;
select *
from clients
where client_name like '%it%';
update clients
set client_name = 'gojo'
where client_name = 'Gojo';
select sum(client_accbal) as total_earnings
from clients;
select avg(client_accbal) as average_earnings
from clients;
select max(client_accbal) as max_earnings
from clients;
select count(distinct c_date) as total_date
from clients;
select regime_id,
    regime_name,
    regime_address,
    regime_city,
    regime_state,
    regime_country,
    regime_media,
    regime_description,
    regime_start_date,
    regime_start_time,
    regime_end_date,
    regime_end_time,
    c_date,
    c_time
from regimes
where regime_type = 'concert'
    or regime_type = 'theatre'
    or regime_type = 'conference'
    and regime_city = 'calabar'
order by (c_date, c_time) DESC;
select *
from pricings;
-- simple
SELECT * FROM transactions LEFT OUTER JOIN pricings 
ON transactions.pricing_id = pricings.pricing_id;
-- complex
SELECT 
clients.client_name,
transactions.transaction_id, 
transactions.amount, 
pricings.pricing_name,
pricings.pricing_amount,
transactions.transaction_date,
transactions.transaction_time
FROM clients LEFT OUTER JOIN transactions 
ON  
transactions.client_id = clients.client_id
LEFT OUTER JOIN pricings  
on
transactions.pricing_id = pricings.pricing_id 
where transactions.regime_id = 'PT1418836593' 
order by (transactions.transaction_date, transactions.transaction_time) desc;
-- very complex
SELECT 
regimes.regime_id,
regimes.regime_name, 
regimes.regime_media, 
regimes.regime_type,
regimes.regime_city,
regimes.c_date,
regimes.c_time,
min(pricings.pricing_amount) as min_ticket_price
FROM regimes 
LEFT OUTER JOIN pricings  
on
regimes.regime_id = pricings.regime_id 
where regimes.regime_city = 'calabar' and 
regimes.regime_type = 'concert' or regimes.regime_type = 'party'
group by 
regimes.regime_id,
regimes.regime_name, 
regimes.regime_media, 
regimes.regime_type,
regimes.regime_city,
regimes.c_date,
regimes.c_time
order by (regimes.c_date, regimes.c_time) desc;
-- popular
WITH most_popular AS 
    (select pricings.regime_id as idd, 
    count(pricings.regime_id) as regimes from tickets
    LEFT OUTER JOIN pricings
    ON
    tickets.pricing_id = pricings.pricing_id   
    GROUP BY tickets.pricing_id, pricings.regime_id)
    select idd, sum(regimes) as ticket_bought from most_popular
    group by most_popular.idd;

INSERT INTO company (
	company_id,
	company_name,
	company_email,
	company_address,
	company_city,
    company_state,
    company_country,
    company_password,
    company_logo,
    company_logo_id,
    company_accbal,
    theatre_percentage,
    concert_percentage,
    service_percentage,
    conference_percentage,
    pageantry_percentage,
    education_percentage,
    carnival_percentage,
    festival_percentage,
    party_percentage,
    sport_percentage,
    talentshow_percentage,
    c_date,
    c_time
) 
VALUES (
	'id', 
	'reventlify', 
	'edijay17@gmail.com',
	'22 road b close',
	'festac town',
	'lagos',
	'nigeria',
	'password',
	'logo',
	'logo_id',
	0.00,
	10,
	10,
	10,
	10,
	10,
	10,
	10,
	10,
	10,
	10,
	10,
	'2023-06-07',
	'13:19:02'
);

SELECT 
      pricings.regime_id,
	  pricings.pricing_id,
	  pricings.pricing_name,
	  tickets.ticket_id,
	  tickets.ticket_buyer_id,
	  tickets.c_date,
	  tickets.c_time
	  FROM tickets
      LEFT JOIN pricings
      ON
      tickets.pricing_id = pricings.pricing_id
	  WHERE
      GROUP BY 
      pricings.regime_id,
	  pricings.pricing_id,
	  pricings.pricing_name,
	  tickets.ticket_id,
	  tickets.ticket_buyer_id,
	  tickets.c_date,
	  tickets.c_time;

      SELECT 
  clients.client_name,
  regimes.regime_id,
  regimes.regime_name, 
  regimes.regime_media, 
  regimes.regime_type,
  regimes.regime_address,
  regimes.regime_city,
  regimes.regime_state,
  regime_start_date,
  regime_start_time,
  regimes.c_date,
  regimes.c_time,
  min(pricings.pricing_amount) as min_ticket_price
  FROM pricings 
  LEFT JOIN regimes  
  ON
  pricings.regime_id = regimes.regime_id 
  LEFT JOIN clients
  ON
  clients.client_id = regimes.creator_id
  WHERE regimes.regime_id = 'cf6721476481'
  GROUP BY 
  clients.client_name,
  regimes.regime_id,
  regimes.regime_name, 
  regimes.regime_media, 
  regimes.regime_type,
  regimes.regime_address,
  regimes.regime_city,
  regimes.regime_state,
  regime_start_date,
  regime_start_time,
  regimes.c_date,
  regimes.c_time
  ORDER BY (regimes.c_date, regimes.c_time) DESC;

-- total no of tickets bought in a regime
 WITH most_popular AS (SELECT 
        regimes.regime_name,
        pricings.pricing_name,
        pricings.pricing_amount,
        COUNT(pricings.regime_id) AS tickets_bought FROM tickets
        LEFT JOIN pricings
        ON
        tickets.pricing_id = pricings.pricing_id
        LEFT JOIN regimes
        ON
        pricings.regime_id = regimes.regime_id
		WHERE regimes.regime_id = 'pt1418836593'
        GROUP BY 
        regimes.regime_name,
        pricings.pricing_name,
        pricings.pricing_amount,
        tickets.pricing_id, 
        pricings.regime_id, 
        regimes.regime_type)
		SELECT SUM(tickets_bought) as tickets_bought, most_popular.regime_name
		from most_popular
        GROUP BY most_popular.regime_name;

-- no of tickets bought in a particular date
WITH the_source AS (SELECT 
        regimes.regime_name,
        regimes.regime_id,
        pricings.pricing_name,
		tickets.c_date,
        COUNT(tickets.ticket_id) AS tickets_bought,
        (pricings.pricing_amount * COUNT(pricings.regime_id)) AS total_amount,
		pricings.pricing_amount
		FROM tickets
        LEFT JOIN pricings
        ON
        tickets.pricing_id = pricings.pricing_id
        LEFT JOIN regimes
        ON
        pricings.regime_id = regimes.regime_id
		WHERE regimes.regime_id = 'pt1418836593' and tickets.c_date = '2023-06-15'
		GROUP BY 
        regimes.regime_name,
        regimes.regime_id,
        pricings.pricing_name,
		pricings.pricing_amount,
		tickets.c_date)
		SELECT SUM(total_amount) as total_amount, 
		SUM(tickets_bought) as tickets_bought, 
		the_source.regime_name, 
		the_source.c_date, 
		the_source.regime_id
		from the_source
        GROUP BY the_source.regime_name, the_source.c_date, the_source.regime_id;
        -- 
WITH most_popular AS (SELECT 
        regimes.regime_name,
        pricings.pricing_name,
        pricings.pricing_amount,
		tickets.c_date,
        COUNT(pricings.regime_id) AS tickets_bought FROM tickets
        LEFT JOIN pricings
        ON
        tickets.pricing_id = pricings.pricing_id
        LEFT JOIN regimes
        ON
        pricings.regime_id = regimes.regime_id
		WHERE regimes.regime_id = 'pt1418836593' and tickets.c_date = '2023-06-15'
        GROUP BY 
        regimes.regime_name,
        pricings.pricing_name,
        pricings.pricing_amount,
        tickets.pricing_id, 
        pricings.regime_id, 
        regimes.regime_type,
		tickets.c_date)
		SELECT SUM(tickets_bought * most_popular.pricing_amount) as tickets_bought
		from most_popular; 
-- no of tickets bought in a particular date and amount for each pricing
SELECT 
        regimes.regime_name,
        pricings.pricing_name,
		tickets.c_date,
        COUNT(pricings.regime_id) AS tickets_bought,
        (pricings.pricing_amount * COUNT(pricings.regime_id)) AS total_amount,
		pricings.pricing_amount
		FROM tickets
        LEFT JOIN pricings
        ON
        tickets.pricing_id = pricings.pricing_id
        LEFT JOIN regimes
        ON
        pricings.regime_id = regimes.regime_id
		WHERE regimes.regime_id = 'pt1418836593' and tickets.c_date = '2023-06-15'
		GROUP BY 
        regimes.regime_name,
        pricings.pricing_name,
		pricings.pricing_amount,
		tickets.c_date;

        -- get roles
SELECT regime_roles.participant_id,
regime_roles.regime_role,
regimes.regime_name,
regimes.regime_id,
regimes.regime_media,
regimes.regime_start_date,
regimes.regime_start_time,
regimes.c_date, regimes.c_time 
FROM regimes
LEFT JOIN regime_roles
ON 
regime_roles.regime_id = regimes.regime_id
where regime_roles.participant_id = '3843388106'
GROUP BY
regime_roles.participant_id,
regime_roles.regime_role,
regimes.regime_name,
regimes.regime_id,
regimes.regime_media,
regimes.regime_start_date,
regimes.regime_start_time,
regimes.c_date,
regimes.c_time
 ORDER BY (regimes.c_date, regimes.c_time) DESC;

--  get roles for a particular regime
SELECT clients.client_name,
clients.client_photo,
regime_roles.participant_id,
regime_roles.regime_role,
regimes.regime_name,
regimes.regime_id,
regimes.regime_media,
regimes.regime_status,
regimes.regime_affiliate,
regimes.regime_start_date,
regimes.regime_start_time,
regimes.c_date, regimes.c_time 
FROM regimes
LEFT JOIN regime_roles
ON 
regime_roles.regime_id = regimes.regime_id
LEFT JOIN clients
on
clients.client_id = regime_roles.participant_id
where regime_roles.participant_id = '3843388106' and regimes.regime_id = 'cf0356091780'
GROUP BY
clients.client_name,
clients.client_photo,
regime_roles.participant_id,
regime_roles.regime_role,
regimes.regime_name,
regimes.regime_id,
regimes.regime_media,
regimes.regime_status,
regimes.regime_affiliate,
regimes.regime_start_date,
regimes.regime_start_time,
regimes.c_date,
regimes.c_time
 ORDER BY (regimes.c_date, regimes.c_time) DESC;

-- helps in dropping unique constraints if need be
alter table regimes drop constraint regimes_regime_name_key;