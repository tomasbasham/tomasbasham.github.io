# frozen_string_literal: true

RSpec.describe 'The home page', type: :feature do
  let(:per_page) { site_config.fetch('paginate') }

  before { visit '/' }

  it 'introduces the author' do
    expect(page).to have_css('.intro__text', text: 'Tomas Basham')
  end

  it 'shows the desk' do
    expect(page).to have_css('.intro .desk')
  end

  it 'has no navigation bar, as the desk links to the same places' do
    expect(page).to have_no_css('.site-nav')
  end

  it 'lists a full page of articles' do
    expect(page).to have_css('.post-list.clearfix .post', count: per_page)
  end

  it 'gives every article a title and a date', :aggregate_failures do
    within('.post-list.clearfix') do
      expect(page).to have_css('.post-title a[href]', count: per_page)
      expect(page).to have_css('time[datetime]', count: per_page)
    end
  end

  describe 'pagination' do
    it 'offers older articles but not newer ones', :aggregate_failures do
      expect(page).to have_link('Older Posts', href: '/page2')
      expect(page).to have_no_link('Newer Posts')
    end

    it 'leads to older articles and back again' do
      click_link 'Older Posts'
      click_link 'Newer Posts'

      expect(page).to have_css('.intro')
    end
  end
end
