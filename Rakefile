desc "Run Vite dev server and Jekyll serve concurrently via Foreman"
task :serve do
  sh "foreman start"
end

desc "Build assets with Vite, then build the Jekyll site for production"
task :build do
  sh "pnpm build"
  sh "jekyll build -c _config.yml,_config_production.yml"
end

desc "Build the Jekyll site for development"
task :build_dev do
  sh "pnpm build"
  sh "jekyll build"
end

desc "Build the Jekyll site for development, then run the test suite"
task :test => :build_dev do
  sh "bundle exec rspec"
end

task default: :serve
