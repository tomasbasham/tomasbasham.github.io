# frozen_string_literal: true

RSpec.describe 'Reading a post in a series', type: :feature do
  context 'when the post belongs to a series' do
    before { visit '/development/hypertext-and-html' }

    it 'names the series' do
      expect(page).to have_css('.series-nav-title', text: 'Web Fundamentals')
    end

    it 'says where the post sits in the series' do
      expect(page).to have_css('.series-nav-position', text: 'Part 2 of 5')
    end

    it 'starts closed' do
      expect(page).to have_css('.series-nav:not([open])')
    end

    context 'when the panel is opened' do
      before { find('.series-nav-summary').click }

      it 'lists every post in the series' do
        expect(page).to have_css('.series-nav-list > .series-nav-item', count: 5)
      end

      it 'shows the post being read in bold and not as a link', :aggregate_failures do
        expect(page).to have_css('.series-nav-current strong', text: 'HyperText and HTML')
        expect(page).to have_no_css('.series-nav-current a')
      end

      it 'links to the other posts in the series' do
        expect(page).to have_css('.series-nav-item a', count: 4)
      end
    end
  end

  context 'when the post does not belong to a series' do
    before { visit '/career/the-new-full-stack-developer' }

    it 'has no series panel' do
      expect(page).to have_no_css('.series-nav')
    end
  end
end
