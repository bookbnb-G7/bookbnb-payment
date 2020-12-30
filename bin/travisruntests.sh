#!/bin/bash
echo "checking server is up..."

echo 'hola'

until curl -o /dev/null -s --connect-timeout 1 'http://localhost:8080';
do
    echo "server still not up, waiting 1 second more...";
    sleep 1;
done;

echo "server up..."

npm test
