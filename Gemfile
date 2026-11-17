# frozen_string_literal: true

source 'https://rubygems.org'
ruby RUBY_VERSION

gem 'execjs', '~> 2.10.0'
gem 'jekyll', '~> 4.4.1'
gem 'kramdown-math-katex', '~> 1.0.1'

group :jekyll_plugins do
  gem 'classifier-reborn',      '~> 2.3.0'
  gem 'jekyll-archives',        '~> 2.2.0'
  gem 'jekyll-compose',         '~> 0.12.0'
  gem 'jekyll-feed',            '~> 0.17.0'
  gem 'jekyll-github-metadata', '~> 2.16.0'
  gem 'jekyll-paginate',        '~> 1.1.0'
  gem 'jekyll-redirect-from',   '~> 0.16.0'
  gem 'jekyll-seo-tag',         '~> 2.8.0'
  gem 'jekyll-sitemap',         '~> 1.4.0'

  # Local plugin
  gem 'jekyll-reading_time', '0.1.0', path: '../../../../libraries/ruby/jekyll-reading_time'
  gem 'jekyll-vite', '0.1.0', path: '../../../../libraries/ruby/jekyll-vite'
end

group :development do
  gem 'foreman'
  gem 'rake'
  gem 'webrick'
end

group :development, :test do
  gem 'capybara'
  gem 'rack-jekyll'
  gem 'rspec'
  gem 'rubocop-jekyll'
  gem 'rubocop-rspec'
  gem 'selenium-webdriver'
end

# Windows and JRuby do not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
platforms :windows, :jruby do
  gem 'tzinfo', '>= 1', '< 3'
  gem 'tzinfo-data'
end

# Performance-booster for watching directories on Windows
gem 'wdm', '~> 0.1', platforms: %i[windows]
