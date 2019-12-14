web: gunicorn BiddingSystem.wsgi --log-file -
worker: celery -A BiddingSystem worker  -loglevel info
beat: celery -A BiddingSystem beat -loglevel info

