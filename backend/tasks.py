from __future__ import absolute_import, unicode_literals
from celery import Celery
from .models import Session
from celery.schedules import crontab

app = Celery()


@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # Executes every Monday morning at 7:30 a.m.
    sender.add_periodic_task(
        crontab(minute='*/2'),
        start_session()
    )
    sender.add_periodic_task(
        crontab(minute='1-59/2'),
        end_session()
    )


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
