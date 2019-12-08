
rm -rf backend/migrations;
python3 manage.py makemigrations backend;
python3 manage.py migrate --fake backend zero;
python3 manage.py migrate;

