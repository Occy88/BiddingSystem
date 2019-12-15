web: gunicorn BiddingSystem.wsgi --log-file -
main_worker: celery -A BiddingSystem worker  --beat -loglevel info

