require "fileutils"
require_relative "manifest"

# Presents site in general.
class Site
  DELIMITER = "=" * 40

  attr_reader :user, :data_dir, :root_dir, :target_dir, :projects, :manifest

  def initialize(user:, data_dir: "_data", target_dir: "")
    @data_dir = data_dir
    @user = user
    @projects = []
    @root_dir = Dir.pwd
    @target_dir = target_dir
    @manifest = Manifest.new(File.join(@root_dir, data_dir, "manifest.json"))
  end

  # Adds bunch of peojects to the site.
  def add_projects(*projects)
    projects.each { |p| p.site = self }
    @projects.concat(projects)
  end

  def prepare
    say "Start preparing deployment"
    Dir.mkdir(data_dir) unless Dir.exists?(data_dir)

    @projects.each do |project|
      FileUtils.mkdir_p(project.api_path) unless Dir.exists?(project.api_path)
    end

    Dir.chdir(data_dir) do
      Dir.mkdir("repos") unless Dir.exists?("repos")
      Dir.chdir("repos") do
        @projects.each do |project|
          Git.clone(project.uri) unless Dir.exists?(project.name)
        end
      end
    end
  end

  def say(message)
    puts DELIMITER
    puts message
    puts DELIMITER
  end

  def deploy
    say "Start building"
    @projects.each(&:deploy)
  end

  def under_repo
    Dir.chdir(repo_path) do
      yield "../.."
    end
  end

  def repo_path
    File.join(data_dir, "repos")
  end

  def target_path
    File.join(root_dir, target_dir)
  end

  class << self
    def make_jekyll_file(file_or_files, options = {})
      if file_or_files.is_a?(Array)
        file_or_files.each do |file|
          _make_jekyll_file(file, options)
        end
      else
        _make_jekyll_file(file_or_files, options)
      end
    end

    private

    def _make_jekyll_file(file, options = {})
      content = File.read(file)
      File.open(file, "w") do |f|
        f << "---\n"
        options[:meta].each do |k, v|
          parsed_value = v.is_a?(String) ? "'#{v}'" : v
          f << "#{k}: #{parsed_value}\n"
        end
        f << "---\n"
        f << content
      end
    end
  end
end
