# bms-notify backend

`// TODO`

## Usage

Run the server locally

```sh
# install deps
$ yarn

# run dynamodb
$ ./shell-scripts/run-dynamodb.sh

# run graphql server on port 62222
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

Install [graphql-playground](https://github.com/prisma/graphql-playground) if you don't have.

```sh
$ brew cask install graphql-playground
```

Now just open the project root in graphql-playground
