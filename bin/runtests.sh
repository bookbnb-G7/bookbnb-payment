#!/bin/sh


ENVIRONMENT=testing docker-compose up --build -d
docker exec bookbnb-payment_web bash -c 'while !</dev/tcp/db/5432; do sleep 1; done;'
docker exec bookbnb-payment_web npm test
docker-compose down
