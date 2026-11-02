# Shortcuts for running Miga with Docker Compose.
# Run `make help` to list them.

COMPOSE := docker compose

.DEFAULT_GOAL := all
.PHONY: all up down re logs ps clean db help

all: up ## Same as `make up`

.env:
	@cp .env.example .env
	@echo "Created .env from .env.example. Change the passwords and secrets in it."

up: .env ## Build and start every service in the background
	$(COMPOSE) up --build --detach
	@port=$$(grep -E '^HTTPS_PORT=' .env | cut -d= -f2); \
	echo "Miga is running at https://localhost:$${port:-8443}"

down: ## Stop every service (data is kept)
	$(COMPOSE) down

re: down up ## Restart everything from a fresh build

logs: ## Follow the logs of every service
	$(COMPOSE) logs --follow

ps: ## Show the state of every service
	$(COMPOSE) ps

clean: ## Stop everything and delete the database, certificates and images
	$(COMPOSE) down --volumes --rmi local --remove-orphans

db: .env ## Start only the database, reachable on localhost:5432 (for pnpm dev and pnpm test)
	$(COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml up --detach db

help: ## List available commands
	@grep -E '^[a-z]+:.*## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*## "} {printf "  make %-6s %s\n", $$1, $$2}'
