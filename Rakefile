# frozen_string_literal: true

require 'rspec/core/rake_task'

RSpec::Core::RakeTask.new(:spec)

require 'rubocop/rake_task'

RuboCop::RakeTask.new

desc 'Run Vite dev server and Jekyll serve concurrently via Foreman'
task :serve do
  sh 'foreman start'
end

desc 'Build assets with Vite, then build the Jekyll site for production'
task :build do
  sh 'pnpm build'
  sh 'jekyll build -c _config.yml,_config_production.yml'
end

desc 'Build the Jekyll site for development'
task :build_dev do
  sh 'pnpm build'
  sh 'jekyll build'
end

task test: %i[build_dev spec rubocop]
task default: :serve
