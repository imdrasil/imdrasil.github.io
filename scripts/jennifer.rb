class Jennifer < Project
  BUILD_COMMAND = "crystal doc ./src/jennifer.cr ./src/jennifer/adapter/mysql.cr ./src/jennifer/adapter/postgres.cr -o ./doc"

  def initialize
    super(name: "jennifer.cr", doc_builder: "sh generate-docs.sh")
    # TODO: temporary solution
    # super(name: "jennifer.cr", doc_builder: BUILD_COMMAND)
  end

  def process_after_deploy
    if Dir.exists?(docs_path)
      FileUtils.rm_r(docs_path)
    end
    FileUtils.mkdir(docs_path)
    repo_dir do |deep|
      Git.checkout("master")
      FileUtils.cp(Dir["docs/*"], docs_path)
    end

    add_guide
  end

  def docs_path
    File.join(target_path, "docs")
  end

  def doc_titles
    @doc_titles ||= doc_files.map { |f| File.readlines(f)[0].tr("#", "").strip }
  end

  private

  def doc_folder
    "doc"
  end

  def doc_files
    @doc_files ||= Dir[File.join(docs_path, "*.md")]
  end

  def add_guide
    doc_titles
    doc_files.each do |path|
      content = File.read(path)
      # title = content.split("\n")[0].tr("#", "").strip
      File.open(path, "w") do |f|
        f << <<~YAML
        ---
        layout: page
        ---
        YAML
        f << header
        f << "{% raw %}\n"
        content.gsub!(".md)", ")")
        f << content
        f << "{% endraw %}"
      end
    end
  end

  def versions_file_template
    super +
      <<~MD
      > All versions up to 0.5.0 present documentations for PostgreSQL adapter. For MySQL one - please compile
      it locally as described in the [README](./index#documentation) file.
      MD
  end

  def header
    @common_header ||=
      begin
        b = binding
        template =
          <<~'HTML'
          <header class="site-header" role="banner">
            <div class="wrapper">
              <nav class="site-nav">
                <div class="trigger">
                  <% doc_files.each_with_index do |file, i| %>
                    <a class="page-link" href="./<%= File.basename(file, ".md") %>">{{ "<%= doc_titles[i] %>" }}</a>
                  <% end %>
                </div>
              </nav>
            </div>
          </header>
          HTML
        ERB.new(template).result(b)
      end
  end
end