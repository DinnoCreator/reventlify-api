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
CREATE TABLE pricings (
    pricing_id TEXT NOT NULL UNIQUE,
    regime_id TEXT NOT NULL REFERENCES regime(regime_id) ON DELETE CASCADE ON UPDATE CASCADE,
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