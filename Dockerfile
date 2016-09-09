FROM ruby:2.2.5-alpine

MAINTAINER Tomas Basham <me@tomasbasham.co.uk>

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install necessary software packages
RUN apk add --no-cache \
  g++ \
  libxml2-dev \
  libxslt-dev \
  make \
  && rm -rf /var/cache/apk/*

COPY Gemfile /usr/src/app/
COPY Gemfile.lock /usr/src/app/

RUN bundle install

ENTRYPOINT ["bundle", "exec"]
