export NODE_ENV='production'

export PRIVATE_KEY=`cat keys/private-key.pem`;
export PUBLIC_KEY=`cat keys/public-key.pub`;
export HASURA_ADMIN_SECRET='';

export PG_CONNECTION_STRING='postgresql://postgres:postgres@localhost:5432/postgres';