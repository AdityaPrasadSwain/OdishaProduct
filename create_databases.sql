-- Check and create databases
-- Note: In pure SQL, 'CREATE DATABASE IF NOT EXISTS' isn't standard in older Postgres without a function or distinct blocks.
-- But since we are likely running this as a setup, we can use the following approach or just rely on errors if they exist.

-- However, with psql, we can't run CREATE DATABASE inside a transaction block easily.
-- The simplest way is to try creating them. If they exist, it will error but that's fine for a setup script.

CREATE DATABASE udrakala_identity;
CREATE DATABASE udrakala_product;
CREATE DATABASE udrakala_order;
CREATE DATABASE udrakala_seller;
CREATE DATABASE udrakala_payment;
