# frozen_string_literal: true

RSpec.describe 'The site', type: :feature do
  it 'tells visitors when a page cannot be found' do
    visit '/404.html'

    expect(page).to have_css('h1', text: '404')
  end

  describe 'feed' do
    before { visit '/feed.xml' }

    it 'is served' do
      expect(page.status_code).to eq(200)
    end

    it 'is an Atom feed of posts', :aggregate_failures do
      expect(page.source).to include('<feed')
      expect(page.source).to include('<entry')
    end
  end
end
