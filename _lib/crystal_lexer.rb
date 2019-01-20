require "rouge"

module Rouge
  module Lexers
    class Crystal < Ruby
      title "Crystal"
      desc "The Crystal programming language"
      tag 'crystal'
      aliases 'cr'
      filenames '*.cr'

      mimetypes 'text/x-crystal', 'application/x-crystal'
    end
  end
end
