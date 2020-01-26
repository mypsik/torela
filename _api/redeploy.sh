mkdir -p logs
docker logs torela_torela_1 2>&1 | gzip > logs/torela-"$(date +%Y-%m-%d_%H:%m:%S)".log.gz
docker-compose -p torela up -d --build
