#!/bin/sh

ENVIRONMENT=testing docker-compose up --build -d

echo "Controlando incio servidor";

until curl -o /dev/null -s --connect-timeout 1 'http://localhost:5000';
do
    echo "Esperando 1 seg(s) a que el servidor se inicie";
    sleep 1;
done;

docker exec bookbnb-payment_web npm test
docker-compose down
