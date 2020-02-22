mkdir -p logs
docker logs torela_torela_1 2>&1 | gzip > logs/torela-"$(date +%Y-%m-%d_%H:%m:%S)".log.gz
docker-compose -f docker-compose.yml -f docker-compose.deploy.yml -p torela up -d --build
