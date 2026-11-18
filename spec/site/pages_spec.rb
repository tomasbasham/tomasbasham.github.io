# frozen_string_literal: true

require 'shared_contexts/page'

pages.each do |p|
  RSpec.describe p do
    before do
      visit p
    end

    it_behaves_like 'Page'
  end
end
