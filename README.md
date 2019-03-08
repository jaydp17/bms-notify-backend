# bms-notify backend

`// TODO`

## Usage

```sh
# install deps
$ yarn

# run locally
$ yarn dev

# query graphql
$ curl -X POST \
  http://localhost:62222/graphql \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: it-does-not-matter-what-key-your-pass-but-its-required' \
  -d '{
	"query": "{ hello }"
}'
```
