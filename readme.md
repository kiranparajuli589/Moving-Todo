[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)

## Moving Todo

A simple todo application where you can manage todo entries.
Most importantly you can move each todo entry to any position you want.
The project is based on:

- simple django api backend is used for database management
- HTML, CSS, JS, AJAX for UI management

![HomePage](Screenshot.png "Screenshot of homepage")

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
make install
```

#### Sql table creation

```shell script
make migrate
```

#### Create super user

```shell script
make admin
```

#### Serve

```shell script
make serve
```

#### Acceptance tests

```shell script
yarn test:e2e test/acceptance/features
# with tags
yarn test:e2e test/acceptance/features -t '@focus and not @skip'
# on firefox
BROWSER=firefox yarn test:e2e test/acceptance/features
```
