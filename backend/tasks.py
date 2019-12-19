from __future__ import absolute_import, unicode_literals
from celery import Celery
from .models import Session
from celery.schedules import crontab

app = Celery()


@app.task
def start_session():
    Session.objects.create()
    print("STARTING SESSION")


@app.task
def end_session():
    print("ENDING SESSION")
    sess = Session.objects.get_queryset().filter(active=True)
    for s in sess:
        s.active = False
        s.save()


@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        crontab(minute='*/2'),
        start_session()
    )
    sender.add_periodic_task(
        crontab(minute='1-59/2'),
        end_session()
    )


app.conf.beat_schedule = {
    'task-number-1': {
        'task': 'backend.tasks.start_session',
        'schedule': crontab(minute='*/2'),
        'args': ('')
    },
    'ask-number-2': {
        'task': 'backend.tasks.end_session',
        'schedule': crontab(minute='1-59/2'),
        'args': ('')
    }
}
