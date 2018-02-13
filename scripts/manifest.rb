require "json"

class Manifest
  def initialize(source)
    @data = JSON.parse(File.read(source))
    @path = source
  end

  def hash(project)
    @data[project]
  end

  def set_hash(project, value)
    @data[project] = value
    sync
    value
  end

  private

  def sync
    File.open(@path, "w") do |f|
      f << JSON.pretty_generate(@data)
    end
  end
end
