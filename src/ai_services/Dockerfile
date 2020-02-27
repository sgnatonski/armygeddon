
# Base service image
FROM nikolaik/python-nodejs:python3.5-nodejs12 AS ai_services_x64
RUN apt-get update && apt-get install -y build-essential libxi-dev libglu1-mesa-dev libglew-dev pkg-config && apt-get clean && apt-get autoremove
WORKDIR /app
COPY /src/common/package.json ./common/
COPY /src/ai_services/package.json ./services/
RUN npm i services --prod
COPY ./src/common/ ./common/
COPY ./src/ai_services/ ./services/
