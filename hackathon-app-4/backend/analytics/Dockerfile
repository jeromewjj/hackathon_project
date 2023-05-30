FROM golang:1.19-alpine

WORKDIR /app

COPY go.mod ./
RUN go mod tidy

COPY . ./

EXPOSE 8080

RUN go build -o /analytics

CMD [ "/analytics" ]