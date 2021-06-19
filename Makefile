ADDRESS:=localhost:8000
ADMIN_PASSWORD:=admin
ADMIN_USERNAME:=admin
ADMIN_EMAIL:=admin@test.com

pip-install:
	pip install -r requirements.txt

yarn-install:
	yarn install

install: pip-install yarn-install

serve:
	python manage.py runserver $(ADDRESS)

make-migrations:
	python manage.py makemigrations $(APP)

migrate:
	python manage.py migrate

create-admin:
	DJANGO_SUPERUSER_PASSWORD=$(ADMIN_PASSWORD)
	python manage.py createsuperuser \
 		--username $(ADMIN_USERNAME) \
		--email $(ADMIN_EMAIL) --noinput
