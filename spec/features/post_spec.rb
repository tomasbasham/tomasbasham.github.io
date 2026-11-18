# frozen_string_literal: true

RSpec.describe 'Reading a post', type: :feature do
  let(:title) { first('.post-list.clearfix .post-title a').text }

  before do
    visit '/'
    click_link title
  end

  it 'shows the post under its title' do
    expect(page).to have_css('h1.post-title', text: title)
  end

  it 'shows who wrote it and when', :aggregate_failures do
    expect(page).to have_css('.author-name', text: 'Tomas Basham')
    expect(page).to have_css('time[datetime]')
  end

  it 'shows how long it takes to read' do
    expect(page).to have_css('.post-reading-time')
  end

  it 'has the article itself' do
    expect(page).to have_css('.post-content', text: /\S/)
  end

  it 'has a navigation bar with the author profiles' do
    expect(page).to have_css('.site-nav .navbar-nav a[href^="https://github.com/tomasbasham"]')
  end

  it 'leads back to the home page through the site name' do
    find('.site-nav .navbar-brand').click

    expect(page).to have_css('.intro')
  end
end
