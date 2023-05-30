FROM golang:1.19-alpine

WORKDIR /app

COPY go.mod ./
RUN go mod tidy

EXPOSE 8080

COPY . ./

RUN go build -o /transactions


CMD [ "/transactions" ]