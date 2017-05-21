FROM ruby:2.2.5-alpine

LABEL maintainer "Tomas Basham <me@tomasbasham.co.uk>"
LABEL description "A Personal Jekyll Blog and Portfolio"

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install necessary software packages
RUN apk add --no-cache \
  g++ \
  git \
  libxml2-dev \
  libxslt-dev \
  make \
  nodejs \
  && rm -rf /var/cache/apk/*

COPY Gemfile /usr/src/app/
COPY Gemfile.lock /usr/src/app/

RUN bundle install

ENTRYPOINT ["bundle", "exec"]
