FROM node:10.18.0-alpine3.10 AS build-env
RUN mkdir /workdir
ADD . /workdir
RUN cd /workdir && yarn install --production
CMD ["node", "/workdir/index.js"]