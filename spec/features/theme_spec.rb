# frozen_string_literal: true

# These examples need a real browser: the colour theme is applied by Alpine
# and remembered in localStorage, neither of which rack_test can run.
RSpec.describe 'The colour theme', :js, type: :feature do
  def pressed(name)
    %(button[title="#{name}"][aria-pressed="true"])
  end

  def stored_theme
    page.evaluate_script("window.localStorage.getItem('theme')")
  end

  # Start every example without a remembered choice, whatever ran before.
  before do
    visit '/'
    page.execute_script('window.localStorage.clear()')
    visit '/'

    # Alpine removes x-cloak once it has started. Wait for that, as nothing
    # happens when a button is clicked before then.
    assert_selector('.theme-switch:not([x-cloak])')
  end

  it 'follows the system until a choice is made', :aggregate_failures do
    expect(page).to have_css(pressed('Match system'))
    expect(page).to have_css('html:not([data-theme])')
    expect(stored_theme).to be_nil
  end

  %w[Light Dark].each do |name|
    it "applies and remembers the #{name} choice", :aggregate_failures do
      click_button name

      expect(page).to have_css(%(html[data-theme="#{name.downcase}"]))
      expect(page).to have_css(pressed(name))
      expect(stored_theme).to eq(name.downcase)
    end
  end

  it 'keeps the choice on other pages and after a reload', :aggregate_failures do
    click_button 'Dark'
    visit '/archive'
    expect(page).to have_css('html[data-theme="dark"]')

    page.refresh
    expect(page).to have_css('html[data-theme="dark"]')
  end

  it 'forgets the choice when set back to the system', :aggregate_failures do
    click_button 'Dark'
    click_button 'Match system'

    expect(page).to have_css('html:not([data-theme])')
    expect(stored_theme).to be_nil
  end
end
