FROM		golang:1.20

WORKDIR		/app

COPY		go.mod go.sum ./
RUN			go mod download

COPY		*.go ./

COPY		config ./config/
COPY		models ./models/
COPY		controllers ./controllers/
COPY		jwt ./jwt/

RUN			go build -o ./backend

CMD			["./backend"]
