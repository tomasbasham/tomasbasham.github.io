# frozen_string_literal: true

# Serves a built Jekyll site the way a static host does: a directory is served
# from its index.html, and a page may be requested without its .html extension.
class JekyllSite
  attr_reader :root, :server

  def initialize(root, server)
    @root   = root
    @server = server
  end

  def call(env)
    env['PATH_INFO'] = resolve(env['PATH_INFO'])
    server.call(env)
  end

  def exist?(path)
    File.exist?(File.join(root, path))
  end

  private

  def resolve(path)
    index = File.join(path, 'index.html')

    if exist?(index)
      index
    elsif !exist?(path) && exist?("#{path}.html")
      "#{path}.html"
    else
      path
    end
  end
end
