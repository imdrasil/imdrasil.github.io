require "erb"
require "natural_sort"

require "pry"

require_relative "git"
require_relative "site"
require_relative "project"
require_relative "jennifer"

site = Site.new(user: "imdrasil", target_dir: "src")

doc_builder = "crystal doc"

site.add_projects(
  Jennifer.new,
  Project.new(name: "sam.cr", doc_builder: doc_builder),
  Project.new(name: "crymagick", doc_builder: doc_builder),
  Project.new(name: "ifrit", doc_builder: doc_builder),
  Project.new(name: "hermes.cr", doc_builder: doc_builder),
  Project.new(name: "factory", doc_builder: doc_builder)
)

site.prepare
site.deploy

FileUtils.rm_r("./_src/.", force: true)

`./scripts/compile.sh`

entries = Dir["./_src/**"].map { |name| name.split("/")[-1] }
entries.each do |e|
  path = File.join(".", e)
  FileUtils.rm_r(path) if Dir.exists?(path)
end

FileUtils.cp_r("./_src/.", "./")
