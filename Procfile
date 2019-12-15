web: gunicorn BiddingSystem.wsgi --log-file -
worker: celery -A BiddingSystem worker  --beat -loglevel info

