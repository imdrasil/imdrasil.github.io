source "https://rubygems.org"

gem "jekyll", "~> 3.9.0"

# This is the default theme for new Jekyll sites. You may change this to anything you like.
gem "minima", "~> 2.0"
gem "redcarpet"
gem "rouge"
gem "natural_sort"
gem "pry"

gem "activesupport", "~>6.0.6"
gem "faraday", "= 1.0.1"
gem "listen", "= 3.5.0"
gem "nokogiri", "= 1.10.10"
gem "rubyzip", "= 1.3.0"

group :jekyll_plugins do
  # If you want to use GitHub Pages, remove the "gem "jekyll"" above and
  # uncomment the line below. To upgrade, run `bundle update github-pages`.
  gem "github-pages", "= 207"
  gem "jekyll-feed", "= 0.13"
end

require_relative "_lib/crystal_lexer" if defined?(Rouge)
