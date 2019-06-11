source "https://rubygems.org"

#gem "jekyll", "~> 3.6.2"

# This is the default theme for new Jekyll sites. You may change this to anything you like.
gem "minima", "~> 2.0"
gem "redcarpet"
gem "rouge"
gem "natural_sort"
gem "pry"

# If you want to use GitHub Pages, remove the "gem "jekyll"" above and
# uncomment the line below. To upgrade, run `bundle update github-pages`.
gem "github-pages", group: :jekyll_plugins

group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.6"
end

require_relative "_lib/crystal_lexer" if defined?(Rouge)
