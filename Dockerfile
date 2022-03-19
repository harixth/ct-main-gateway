FROM node:14-alpine as builder

WORKDIR /home/node
COPY . /home/node

RUN npm ci \
    && npm run build

# ---

FROM node:14-alpine

WORKDIR /home/node

COPY --from=builder /home/node/node_modules /home/node/node_modules
COPY --from=builder /home/node/dist/ /home/node/dist/

EXPOSE 4000

CMD ["node", "dist/main.js"]