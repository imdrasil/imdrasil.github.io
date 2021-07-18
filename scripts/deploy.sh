project=$1

bundle exec ruby scripts/build.rb ${project-all} --doc "$2" --exclude "$3" &&
  git add . &&
  git commit -m"Automatic deploy for $(date -I'seconds')." &&
  git push origin HEAD
