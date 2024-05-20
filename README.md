# file-share
Simple service for sharing files via web

## Run dev. env. locally

```
docker-compose up postgres

cd api
cp .env.example .env
# correct .env
npm run start:dev

cd client
npm run dev
```

## TODO

- check working filenames and paths on FS; there would be security holes!
- check max. file size!
- refactor: use pure streams instead of multipart and buffer for uploading/downloading
- support large files
- use slug/uuid instead of original filenames
- add datetime to file records; add column in files list
- horiz. align sizes values in the table
- make file size human-readable, like 2.4M, 300K
- check that uploaded file is zip archive
- handle errors
- show errors/infos in UI instead of pure alert
- docker-compose; run api and client in containers
- Download button should be disabled if no checkbox checked
- load configuration from .env
- refactor downloadArchive: avoid location redirect hack
