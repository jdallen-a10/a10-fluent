VERSION=$(cat package.json | jq .version | tr -d \")
docker build -t a10networks/a10-fluent:$VERSION -t a10networks/a10-fluent:latest .

