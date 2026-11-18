# frozen_string_literal: true

RSpec.describe 'The archive', type: :feature do
  before do
    visit '/'
    within('.site-footer') { click_link 'Archive' }
  end

  it 'is reached from the footer' do
    expect(page).to have_css('h1.post-title', text: 'Archive')
  end

  it 'groups posts by year, back to the first' do
    expect(page).to have_css('.post-content h2', text: '2013')
  end

  it 'links to posts that can be read' do
    link = first('.post-content li a')
    title = link.text
    link.click

    expect(page).to have_css('h1.post-title', text: title)
  end
end
