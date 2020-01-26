mkdir -p logs
docker logs torela_torela_1 >logs/torela-"$(date +%Y-%m-%d_%H:%m:%S)".log 2>&1
docker-compose -p torela up -d --build
