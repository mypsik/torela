#!/bin/bash

mkdir -p logs
docker logs torela_torela_1 2>&1 | gzip > logs/torela-"$(date +%Y-%m-%d_%H:%m:%S)".log.gz
docker compose -f compose.yml -f compose.deploy.yml -p torela up -d --build
