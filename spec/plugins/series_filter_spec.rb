# frozen_string_literal: true

require 'jekyll'
require_relative '../../_plugins/series'

RSpec.describe Jekyll::SeriesFilter do
  subject(:filter) do
    Class.new { include Jekyll::SeriesFilter }.new.tap do |instance|
      instance.instance_variable_set(:@context, context)
    end
  end

  let(:context) { instance_double(Liquid::Context, registers: { site: site }) }
  let(:site) { instance_double(Jekyll::Site, posts: collection) }
  let(:collection) { instance_double(Jekyll::Collection, docs: posts) }

  let(:posts) do
    [
      post('2025-05-03-third.md',  '2025-05-03', 'web-fundamentals'),
      post('2025-05-01-first.md',  '2025-05-01', 'web-fundamentals'),
      post('2025-05-02-second.md', '2025-05-02', 'web-fundamentals'),
      post('2025-05-02-other.md',  '2025-05-02', 'enron'),
      post('2025-05-04-single.md', '2025-05-04', nil)
    ]
  end

  def post(path, date, series)
    instance_double(
      Jekyll::Document,
      data: series ? { 'series' => series } : {},
      date: Time.utc(*date.split('-').map(&:to_i)),
      relative_path: "_posts/#{path}"
    )
  end

  it 'returns the posts in the series, oldest first' do
    expect(filter.series_posts('web-fundamentals').map(&:relative_path)).to eq(
      %w[_posts/2025-05-01-first.md _posts/2025-05-02-second.md _posts/2025-05-03-third.md]
    )
  end

  it 'leaves out posts from other series and posts in none' do
    expect(filter.series_posts('enron').map(&:relative_path)).to eq(['_posts/2025-05-02-other.md'])
  end

  it 'finds nothing for a series that does not exist' do
    expect(filter.series_posts('missing')).to eq([])
  end

  it 'finds nothing when there is no series', :aggregate_failures do
    expect(filter.series_posts(nil)).to eq([])
    expect(filter.series_posts('')).to eq([])
  end
end
