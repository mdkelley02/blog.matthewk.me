.PHONY: build
build:
	cd cmd && GOOS=linux GOARCH=amd64 go build -v -ldflags '-d -s -w' -a -tags netgo -installsuffix netgo -o ../dist/app .
