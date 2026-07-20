#!/bin/bash
set -e

ENV_FILE="$(dirname "$0")/../backend/.env"

if [ -f "$ENV_FILE" ]; then
  export $(grep -v '^#' "$ENV_FILE" | xargs)
fi

DB_USER="${POSTGRES_USER:-finance_user}"
DB_PASS="${POSTGRES_PASSWORD:-finance_pass}"
DB_NAME="${POSTGRES_DB:-finance_db}"


sudo -u postgres psql <<EOF
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$DB_USER') THEN
    CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';
    RAISE NOTICE 'user $DB_USER created.';
  ELSE
    RAISE NOTICE 'user $DB_USER already exists.';
  END IF;
END
\$\$;

SELECT 'CREATE DATABASE $DB_NAME OWNER $DB_USER'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec
EOF

echo "Database '$DB_NAME' ready"
