FROM node:10.15.1

# Create app directory
WORKDIR /my-profile

COPY ./package.json .

RUN yarn install --production
# RUN npm install

COPY ./dist/ ./dist/
COPY ./.env.production ./.env
COPY ./ormconfig.json .

ENV NODE_ENV production

EXPOSE 8080

CMD [ "node", "dist/index.js" ]