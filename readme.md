[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)

## Moving Todo

A simple todo application where you can manage todo entries.
Most importantly you can move each todo entry to any position you want.
The project is based on:

- simple django api backend is used for database management
- HTML, CSS, JS, AJAX for UI management

![](Screenshot.png)

### Installation guide (Linux Ubuntu)

Clone the project in your storage and `change directory` to the project

```shell script
git clone https://github.com/kiranparajuli589/Moving-Todo.git
```

#### Setup virtual environment

```shell script
python -m venv myenv
source myenv/bin/activate
```

#### Install requirements

```shell script
pip install -r requirements.txt
```

#### Sql table creation

```shell script
python manage.py makemigrations
python manage.py migrate
```

#### Create super user

```shell script
python manage.py createsuperuser
```

#### Localhost

```shell script
python manage.py runserver 172.17.0.1:8000
```

so that you can run selenium from docker

#### Check database through link:

http://172.17.0.1:8000/admin/todo/todo/

#### To run acceptance tests

##### Start selenium using docker as

```shell script
docker run -d -p 4444:4444 -p 5900:5900 -v /dev/shm:/dev/shm selenium/standalone-chrome-debug
```

##### Install test dependencies as

```shell script
yarn install
```

##### Run tests as

```shell script
yarn run test test/acceptance/features
```
