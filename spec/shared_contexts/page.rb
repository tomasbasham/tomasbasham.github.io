# frozen_string_literal: true

RSpec.shared_examples_for 'Page' do
  it 'has top-level menu' do
    # expect(page).to have_css("#logo-col a[href~='/']")
    # expect(page).to have_link('Start a project', href: '/start.html')
    # expect(page).to have_link('Get tools', href: '/tools.html')
    # expect(page).to have_link('Languages & databases', href: '/tech.html')
    # expect(page).to have_link('Deploy and distribute', href: '/deployment.html')
    # expect(page).to have_css('ul.nav li', count: 4)
  end

  it 'has footer' do
    expect(page).to have_css('.site-footer')

    # 4 sections: About, Download, Support, Join
    # expect(page).to have_css('.footer h3.widget-title', count: 4)

    # Footer links
    # expect(page).to have_link('About Developer Portal', href: '/about.html')
    # expect(page).to have_link('Fedora Magazine', href: 'https://fedoramagazine.org')
    # expect(page).to have_link('Torrent Downloads', href: 'https://torrents.fedoraproject.org')
    # expect(page).to have_link('Forums', href: 'https://fedoraforum.org/')
    # expect(page).to have_link('Planet Fedora', href: 'http://fedoraplanet.org')
    # expect(page).to have_link('Fedora Community', href: 'https://fedoracommunity.org/')
    # expect(page).to have_css('.footer a', count: 27)

    # expect(page).to have_css('.footer p.copy', text: /© [0-9]+ Red Hat, Inc. and others./)
  end
end
