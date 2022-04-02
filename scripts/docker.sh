docker build . -t ct-main-gateway

docker tag ct-main-gateway:latest asia.gcr.io/wealthbee/ct-main-gateway:latest
docker push asia.gcr.io/wealthbee/ct-main-gateway:latest

docker run -d -p 4000:4000 ct-main-gateway