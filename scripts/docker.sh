docker build . -t crypto-tracker-gateway
docker run -d -p 4000:4000 crypto-tracker-gateway