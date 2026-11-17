# frozen_string_literal: true

require 'shared_contexts/page'

pages.each do |p|
  RSpec.describe p do
    before do
      visit p
    end

    # it 'has only valid internal hyperlinks' do
    #   page.all(:css, 'a').each do |link|
    #     next if link.text == '' || link[:href].match(%r{(http|//).*})

    #     page.find(:xpath, link.path).click
    #     expect(page.status_code).to be(200), "expected link '#{link.text}' to work"
    #     visit p # Go back to the previous page.
    #   end
    # end

    it_behaves_like 'Page'
  end
end
