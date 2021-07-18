project=$1

bundle exec ruby scripts/build.rb --doc "$2" --exclude "$3" ${project-all} &&
  git add . &&
  git commit -m"Automatic deploy for $(date -I'seconds')." &&
  git push origin HEAD
