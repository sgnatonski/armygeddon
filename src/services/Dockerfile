
# Base service image
FROM mhart/alpine-node:12 AS base_services
WORKDIR /app
COPY /src/common/package.json ./common/
COPY /src/services/package.json ./services/
RUN npm i services --prod

# Service images
FROM mhart/alpine-node:slim-12 AS services_x64
WORKDIR /app
COPY ./src/common/ ./common/
COPY ./src/services/ ./services/
COPY --from=base_services ./app/ ./

FROM arm32v7/node:12-alpine AS services_arm7
WORKDIR /app
COPY ./src/common/ ./common/
COPY ./src/services/ ./services/
COPY --from=base_services ./app/ ./

FROM arm32v6/node:12-alpine AS services_arm6
WORKDIR /app
COPY ./src/common/ ./common/
COPY ./src/services/ ./services/
COPY --from=base_services ./app/ ./