ADDRESS:=127.0.0.1:8000
ADMIN_PASSWORD:=admin
ADMIN_USERNAME:=admin
ADMIN_EMAIL:=admin@test.com

install:
	pip install -r requirements.txt

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
