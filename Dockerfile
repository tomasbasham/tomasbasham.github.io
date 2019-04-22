FROM eu.gcr.io/dockyard/ruby:2.6.2-onbuild

# Install git for jekyll-github-metadata
RUN apk add --no-cache \
  git \
  && rm -rf /var/cachr/apk/*

ENTRYPOINT ["bundle", "exec"]
