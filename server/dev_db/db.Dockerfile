FROM mongo:8.0.17
# NOTE: Above should be parity with prod mongo version, change if necessary

EXPOSE 27017

ENV MONGO_INITDB_ROOT_USERNAME=localdev
ENV MONGO_INITDB_ROOT_PASSWORD=password

# REF for continuing setup: https://hub.docker.com/_/mongo

# Optional: copy initialization scripts
# COPY ./init-scripts/*.js /docker-entrypoint-initdb.d/
COPY ./init-mongo.js /docker-entrypoint-initdb.d/

# This will run the seed.js script on the first run of the container

# Also consider consider:
# Add seed/migration scripts per mongo best practices that aren't run automatically
# For example:
# COPY ./create-db-script-example ./create-db-script-example
# COPY ./reset-db-script-example ./reset-db-script-example
# COPY ./seed-db-script-example ./seed-db-script-example

# For example if this was postgres, these scripts may look like:
# echo 'CREATE DATABASE "quotevote-dev"; CREATE DATABASE "quotevote-test";' | psql -U postgres

# These can be used in a local script:
# docker exec quotevote-mongo /create-db-script-example