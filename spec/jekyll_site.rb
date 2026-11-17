# frozen_string_literal: true

class JekyllSite
  attr_reader :root, :server

  def initialize(root, server)
    @root   = root
    @server = server
  end

  def call(env)
    path = env['PATH_INFO']

    # Use index.html for / paths
    if path.end_with?('/') && exist?("#{path}index.html")
      env['PATH_INFO'] = "#{path}index.html"
    elsif !exist?(path) && exist?("#{path}.html")
      env['PATH_INFO'] += '.html'
    end

    server.call(env)
  end

  def exist?(path)
    File.exist?(File.join(root, path))
  end
end
