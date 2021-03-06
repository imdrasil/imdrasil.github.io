#!/usr/bin/env ruby

require "erb"
require "natural_sort"
require "pry"

require_relative "git"
require_relative "site"
require_relative "project"
require_relative "jennifer"

repo = ARGV[0]
doc_build_command = ARGV[1] || "crystal doc"

site = Site.new(user: "imdrasil", target_dir: "src")

supported_projects = [
  Jennifer.new,
  Project.new(name: "sam.cr", doc_builder: doc_build_command),
  Project.new(name: "crymagick", doc_builder: doc_build_command, skip_versions: %w(v0.1.1 v0.2.0)),
  Project.new(name: "hermes.cr", doc_builder: doc_build_command),
  Project.new(name: "serializer", doc_builder: doc_build_command),
  Project.new(name: "jennifer_twin", doc_builder: doc_build_command),
  Project.new(name: "factory", doc_builder: doc_build_command, skip_versions: %w(v0.1.2 v0.1.1)),
  # Project.new(name: "jennifer_sqlite3_adapter", doc_build_command: "sh generate-docs.sh", skip_versions: %w(v0.1.0 0.2.0)),
  Project.new(name: "form_object", doc_builder: "sh generate-docs.sh", skip_versions: %w(v0.2.0)),
  Project.new(name: "view_model.cr", doc_builder: doc_build_command, skip_versions: %w(v0.1.0)),
  Project.new(name: "flash_container.cr", doc_builder: doc_build_command),
  Project.new(name: "http_method_emulator", doc_builder: doc_build_command),
  Project.new(name: "pager", doc_builder: doc_build_command),
  Project.new(name: "email_opener", doc_builder: "sh generate-docs.sh", skip_versions: %w(v0.1.0)),
  Project.new(name: "sage", doc_builder: doc_build_command),
  Project.new(name: "ifrit", doc_builder: doc_build_command)
]

projects =
  if repo == 'all' || repo.nil?
    supported_projects
  else
    [supported_projects.find { |project| project.name == repo }]
  end

site.add_projects(*projects)

site.prepare
site.deploy

FileUtils.rm_r("./_src/.", force: true)

puts `./scripts/compile.sh`

entries = Dir["./_src/**"].map { |name| name.split("/")[-1] }
entries.each do |e|
  path = File.join(".", e)
  FileUtils.rm_r(path) if Dir.exists?(path)
end

FileUtils.cp_r("./_src/.", "./")
