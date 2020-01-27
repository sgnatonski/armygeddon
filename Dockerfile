
# Base front image
FROM mhart/alpine-node:12 AS base_front
WORKDIR /app
COPY /src/common/package.json ./common/
COPY /src/front/package.json ./front/
RUN npm i front --prod

# Base service image
FROM mhart/alpine-node:12 AS base_services
WORKDIR /app
COPY /src/common/package.json ./common/
COPY /src/services/package.json ./services/
RUN npm i services --prod

# Front images
FROM mhart/alpine-node:slim-12 AS front_x64
WORKDIR /app
COPY /src/common/ ./common/
COPY /src/front/ ./front/
COPY --from=base_front ./app/ ./

FROM arm32v7/node:12-alpine AS front_arm7
WORKDIR /app
COPY /src/common/ ./common/
COPY /src/front/ ./front/
COPY --from=base_front ./app/ ./

FROM arm32v6/node:12-alpine AS front_arm6
WORKDIR /app
COPY ./src/common/ ./common/
COPY ./src/front/ ./front/
COPY --from=base_front ./app/ ./

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