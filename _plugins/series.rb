# frozen_string_literal: true

module Jekyll
  # Exposes the posts that make up a series to Liquid.
  #
  # A post joins a series by naming it in its front matter:
  #
  #   series: web-fundamentals
  #
  # Templates then ask for the members of a series with the `series_posts`
  # filter and decide for themselves how to display them:
  #
  #   {% assign members = page.series | series_posts %}
  #
  # The filter only finds the posts. Titles, ordering controls and markup belong
  # to the template (see _includes/series-nav.html).
  module SeriesFilter
    # Returns the published posts whose `series` front matter matches +key+,
    # oldest first. An empty or missing key matches nothing.
    def series_posts(key)
      return [] if key.to_s.strip.empty?

      site = @context.registers[:site]

      site.posts.docs
          .select { |post| post.data['series'].to_s == key.to_s }
          .sort_by { |post| [post.date, post.relative_path] }
    end
  end
end

Liquid::Template.register_filter(Jekyll::SeriesFilter)
