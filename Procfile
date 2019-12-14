web: gunicorn BiddingSystem.wsgi --log-file -
worker: celery -A BiddingSystem  worker -events -loglevel info 
beat: celery -A BiddingSystem beat -events -loglevel info 

