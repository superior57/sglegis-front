npm run build
ssh-add ~/.ssh/cleiton/id_rsa
rsync -azP --delete ./public/* dokku-prod:/storage/dokku/sglegis/public