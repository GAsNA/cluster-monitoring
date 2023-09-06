FROM		golang:1.20

WORKDIR		/app

COPY		go.mod ./
RUN			go mod download

COPY		src/*.go ./

RUN			go build -o ./backend

CMD			["./backend"]
