web: gunicorn BiddingSystem.wsgi --log-file -
worker: celery -A BiddingSystem worker -l info 
beat: celery -A BiddingSystem beat -l info 

