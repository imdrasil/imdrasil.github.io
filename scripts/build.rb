#!/usr/bin/env ruby

require "erb"
require "natural_sort"
require "pry"
require 'optparse'

require_relative "git"
require_relative "site"
require_relative "project"
require_relative "jennifer"

repo = ARGV[-1] || 'all'
opts = ARGV.getopts('', 'doc:', 'exclude:', 'only:')

# puts ARGV
# puts opts
doc_build_command = opts['doc']
doc_build_command = "crystal doc" if doc_build_command.nil? || doc_build_command.empty?
skip_versions = opts['exclude']
only_versions = opts['only']

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
    project = supported_projects.find { |project| project.name == repo }
    if only_versions
      project.only_versions = only_versions.split(',')
    elsif skip_versions
      project.skip_versions.concat(skip_versions.split(','))
    end
    [project]
  end

site.add_projects(*projects)

site.prepare
site.deploy

FileUtils.rm_r("./_src/.", force: true)

puts `./scripts/compile.sh`

entries = Dir["./_src/**"].map { |name| name.split("/")[-1] }
if repo == 'all' # TODO: fix this
  entries.each do |e|
    path = File.join(".", e)
    FileUtils.rm_r(path) if Dir.exists?(path)
  end
  FileUtils.cp_r("./_src/.", "./")
else
  %w[feed.xml index.html assets].each do |name|
    path = File.join('.', name)
    FileUtils.rm_r(path) if File.exists?(path) || Dir.exists?(path)
    FileUtils.cp_r(File.join('./_src', name), path)
  end
  %w[index.html versions.html].each do |name|
    path = File.join('.', repo, name)
    FileUtils.rm_r(path) if File.exists?(path)
  end
  Dir[File.join("./_src", repo, '*')].each do |path|
    name = path.split('/')[-1]
    target_path = File.join(repo, name)
    FileUtils.rm_r(target_path) if Dir.exists?(path) && Dir.exists?(target_path)

    FileUtils.cp_r(path, target_path)
  end
end
