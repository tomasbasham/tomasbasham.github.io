# frozen_string_literal: true

Jekyll::Hooks.register [:posts, :pages], :post_render do |doc|
  # Unwrap images inside <figure> tags by removing surrounding <p> tags. These
  # <p> tags are often added by Markdown processors and can interfere with
  # styling.
  doc.output.gsub!(%r{<figure([^>]*)>\s*<p>(<img[^>]*>)</p>\s*(<figcaption>)}m, '<figure\1>\2\3')
end
