from django.contrib import admin
from django.contrib.auth.models import User
from django.db import models
from django.conf import settings
from pydoc import locate
from django.conf import settings
from django.utils import timezone
import datetime


# admin.site.register(Truck)
# admin.site.register(Product)
# admin.site.register(StorageZone)
# admin.site.register(StorageZoneUnit)

class Session(models.Model):
    time_start = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)


class Bid(models.Model):
    user = models.ForeignKey(User, blank=False, null=False, on_delete=models.CASCADE)
    price = models.FloatField(null=False, blank=False)
    quantity = models.FloatField(null=False, blank=False)
    session = models.ForeignKey(Session, on_delete=models.CASCADE)
    time = models.DateTimeField(auto_now_add=True)
