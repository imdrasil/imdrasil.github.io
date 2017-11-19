require "erb"
require "natural_sort"

require_relative "git"
require_relative "site"
require_relative "project"
require_relative "jennifer"

site = Site.new("imdrasil")
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

`./scripts/compile.sh`
