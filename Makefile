all: 
					docker compose up --build

stop:
					docker compose stop

down:
					docker compose down

clean:
					docker image prune -f

fclean:				down
					docker image prune -f -a

re:					fclean all

image:
					docker image ls

bash:
					docker compose exec $(arg) /bin/bash

dbclean:			clean
					docker volume rm cluster-monitoring_data

.PHONY: all stop down clean fclean re image bash
