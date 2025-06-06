# STAGE 1
FROM node:20-bullseye as build
WORKDIR /app-stage-1
ARG NPM_ARGS=""
COPY . .
RUN apt-get update && \
    apt-get install -y --no-install-recommends git && \
    rm -rf /var/lib/apt/lists/*
RUN npm install $NPM_ARGS && npx prisma generate

RUN git clone https://github.com/matomo-org/travis-scripts.git

# STAGE 2
FROM node:20-slim
WORKDIR /usr/app

# Install necessary packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    wget \
    ca-certificates \
    libreoffice-writer \
    fontconfig \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdrm2 \
    libgbm1 \
    libglib2.0-0 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    libu2f-udev \
    libvulkan1 \
    libxkbcommon0 \
    libxshmfence1 \
    libasound2 \
    libatspi2.0-0 \
    libpangocairo-1.0-0 \
    libpango-1.0-0 \
    libcairo2 \
    libgtk-3-0 \
    libssl-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    fc-cache -f -v

# Install fonts
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    fonts-lato \
    fonts-open-sans \
    fonts-roboto \
    fonts-mononoki \
    fonts-noto-mono && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    fc-cache -f -v

# Copy necessary files
COPY --from=build /app-stage-1/node_modules /usr/app/node_modules
COPY --from=build /app-stage-1/travis-scripts/fonts /usr/share/fonts/truetype/libreoffice
COPY --from=build /app-stage-1/package.json /usr/app/package.json
COPY --from=build /app-stage-1/prisma /usr/app/prisma
COPY --from=build /app-stage-1/app.js /usr/app/app.js
COPY --from=build /app-stage-1/src /usr/app/src
COPY --from=build /app-stage-1/test /usr/app/test
COPY --from=build /app-stage-1/node_modules/.prisma /usr/app/node_modules/.prisma

# Make test scripts executable and create storage directories
RUN mkdir -p /usr/app/storage && \
    mkdir -p /usr/app/storage/images && \
    mkdir -p /usr/app/storage/templates && \
    mkdir -p /usr/app/storage/cms/beranda && \
    mkdir -p /usr/app/storage/cms/artikel
ENV NODE_ENV=test

CMD ["npm", "run", "start"]
