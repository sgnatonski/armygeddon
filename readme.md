docker run -p 8529:8529 -e ARANGO_NO_AUTH=1 --volumes-from arangodb-persist arangodb/arangodb:3.6.0

pm2 start armygeddon.json --no-daemon