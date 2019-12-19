celery -A BiddingSystem beat -l info &
celery -A BiddingSystem worker -l info &
