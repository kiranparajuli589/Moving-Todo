#setup virtual environment
python -m venv myenv
source myenv/bin/activate
#install requirements
pip install -r requirements.txt

#sql table creation
python manage.py makemigrations
python manage.py migrate

#create super user
python manage.py createsuperuser

#localhost
python manage.py runserver

#check database through link:
http://127.0.0.1:8000/admin/todo/todo/

