FROM node:alpine

MAINTAINER John D. Allen <jallen@a10networks.com>

RUN mkdir /proxy
WORKDIR /proxy
ADD package.json /proxy/
RUN npm install

COPY fluentproxy.js /proxy
ADD config.json /proxy/
ADD Dockerfile .
ADD build_container.sh .

EXPOSE 514

CMD [ "npm", "start" ]

