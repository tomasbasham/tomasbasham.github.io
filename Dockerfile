FROM ruby:2.2.5-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install necessary software packages
RUN apk add --update \
  gcc \
  g++ \
  libc-dev \
  libxml2-dev \
  libxslt-dev \
  make \
  && rm -rf /var/cache/apk/*

COPY Gemfile /usr/src/app/
COPY Gemfile.lock /usr/src/app/

RUN bundle install

COPY . /usr/src/app

ENTRYPOINT ["bundle", "exec"]
