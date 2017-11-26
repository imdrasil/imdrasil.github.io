module Git
  module_function

  def clone(project)
    `git clone #{project}`
  end

  def pull
    `git pull origin HEAD`
  end

  def commit(message)
    `git commit -m"#{message}"`
  end

  def checkout(sha)
    `git checkout #{sha}`
  end

  def tags
    `git tag`.split("\n")
  end

  def versions
    `git tag -l v*`.split("\n")
  end

  def fetch
    `git fetch`
  end

  def sha
    `git rev-parse HEAD`.chomp
  end
end
