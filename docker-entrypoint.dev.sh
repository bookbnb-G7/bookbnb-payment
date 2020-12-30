#!/bin/sh
until curl -o /dev/null -s --connect-timeout 1 'http://localhost:8080';
do
    echo "Esperando 1 seg(s) a que el servidor se inicie";
    sleep 1;
done;