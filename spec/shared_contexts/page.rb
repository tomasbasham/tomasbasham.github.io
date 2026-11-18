# frozen_string_literal: true

# What every page of the site has in common. pages_spec.rb runs these against
# each HTML file in _site, so they cover only what the application layout adds
# to every page: the head, the colour theme control and the footer.
RSpec.shared_examples_for 'Page' do
  it 'is in English' do
    expect(page).to have_css('html[lang="en"]')
  end

  it 'has a title that names the site' do
    expect(page).to have_title(/Tomas Basham/)
  end

  it 'links a stylesheet' do
    expect(page).to have_css('link[rel="stylesheet"]', visible: :all, minimum: 1)
  end

  it 'loads the application script' do
    expect(page).to have_css('script[src]', visible: :all, minimum: 1)
  end

  it 'has an icon' do
    expect(page).to have_css('link[rel~="icon"]', visible: :all, minimum: 1)
  end

  it 'offers a choice of system, light or dark colours' do
    expect(page).to have_css('.theme-switch-option', visible: :all, count: 3)
  end

  describe 'footer' do
    it 'is present' do
      expect(page).to have_css('.site-footer')
    end

    it 'has a menu each for interests, links and profiles' do
      expect(page).to have_css('.site-footer .footer-menu', count: 3)
    end

    it 'links to the blog, the archive and the feed', :aggregate_failures do
      within('.site-footer') do
        expect(page).to have_link('Blog', href: '/')
        expect(page).to have_link('Archive', href: '/archive')
        expect(page).to have_link('RSS', href: '/feed.xml')
      end
    end

    it 'links to the author profiles' do
      expect(page).to have_css('.site-footer a[href^="https://github.com/tomasbasham"]')
    end

    it 'shows the copyright' do
      expect(page).to have_css('.site-footer .copyright', text: /© \d{4}/)
    end
  end
end
