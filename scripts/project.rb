# Project to be published.
class Project
  KEEP_COUNT = 5

  attr_accessor :site, :new_versions, :name

  attr_reader :skip_versions

  def initialize(name: nil, uri: nil, after_deploy: nil, versions_file: true, doc_builder:, skip_versions: [])
    @uri = uri
    @name = name
    @site = nil
    @doc_builder = doc_builder
    @new_versions = []
    @after_deploy = after_deploy
    @versions_file = versions_file
    @skip_versions = skip_versions
  end

  def uri
    if @uri
      @uri
    else
      "git@github.com:#{@site.user}/#{@name}.git"
    end
  end

  def api_path(version = "latest")
    File.join(@site.target_path, @name, version)
  end

  def target_path
    File.join(@site.target_path, @name)
  end

  def install_shards
    result = `shards install`
    `shards update` if result =~ /Please run shards update instead/
  end

  def build_docs
    if @doc_builder.is_a?(String)
      r = `#{@doc_builder}`
      unless r.empty?
        puts r
        raise "Doc jenerating for #{@name} failed"
      end
    else
      @doc_builder.call(self)
    end
  end

  def deploy
    site.under_repo do |deep|
      Dir.chdir @name do
        current_deep = File.join(deep, "..")
        build(current_deep)

        gv = NaturalSort.sort(Git.versions - skip_versions).reverse!
        @new_versions = gv[0...KEEP_COUNT] - versions

        # binding.pry

        new_versions.each do |v|
          build(current_deep, v)
        end

        # binding.pry
        (versions![KEEP_COUNT..-1] || []).each do |v|
          path = File.join(current_deep, @name, v)
          FileUtils.rm_r(path) if Dir.exists?(path)
        end
      end
    end
    add_index_file
    add_versions_file if @versions_file
    process_after_deploy
  end

  def build(deep, version = "latest")
    @site.say "Start building of #{version} (#{@name})"
    is_latest = version == "latest"
    if is_latest
      Git.fetch
      Git.checkout("master")
      Git.pull
      return if up_to_date?
      @site.manifest.set_hash(@name, Git.sha)
    else
      Git.checkout(version)
    end
    install_shards
    build_docs
    version_path = File.join(target_path, version)
    FileUtils.remove_dir(version_path) if Dir.exists?(version_path)
    Dir.mkdir(version_path)
    FileUtils.cp_r(Dir[doc_folder + "/*"], version_path)
    FileUtils.rm_r(doc_folder)
  rescue => e
    binding.pry
  end

  def repo_dir
    if block_given?
      site.under_repo do |deep|
        Dir.chdir @name do
          yield File.join(deep, "..")
        end
      end
    else
      File.join(site.repo_path, @name)
    end
  end

  def versions
    @versions ||= parse_versions
  end

  def versions!
    @versions = parse_versions
  end

  private

  def doc_folder
    "docs"
  end

  def up_to_date?
    Git.sha == @site.manifest.hash(@name)
  end

  def add_index_file
    project_index_path = File.join(target_path, "index.md")
    FileUtils.cp(File.join(repo_dir, "README.md"), project_index_path)
    Site.make_jekyll_file(project_index_path, meta: { layout: "page" })
  end

  def process_after_deploy
    @after_deploy.call(self) if @after_deploy
  end

  def parse_versions
    NaturalSort.sort(
      Dir.chdir(target_path) do
        Dir["v*"] - ["versions.md"]
      end
    ).reverse!
  end

  def add_versions_file
    File.open(versions_file_path, "w") do |f|
      f << ERB.new(versions_file_template).result(binding)
    end
  end

  def versions_file_path
    File.join(target_path, "versions.md")
  end

  def versions_file_template
    <<~MARKDOWN
    ---
    layout: default
    ---
    # #{@name}

    #{versions_markup}
    MARKDOWN
  end

  def versions_markup
    <<~'MARKDOWN'
    Available documentation versions:

    - [latest](./latest)
    <% versions.each do |v| %>
    - [<%= v %>](<%= "./#{v}" %>)
    <% end %>
    MARKDOWN
  end
end
