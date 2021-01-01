from django.shortcuts import render
from django.views import View
from django.conf import settings
from accounts.models import Profile
from rest_framework.views import APIView
import json
from django.http import HttpResponse, JsonResponse
from pydoc import locate
from django.core import serializers
import os
import random
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import BasePermission
from .models import Session
from accounts.models import Profile
import datetime
from .models import Bid
from rest_framework import generics
from .serializers import BidSerializer, SessionSerializer
from django.views import View


# Create your views here.
class SessionOpenPermission(BasePermission):
    def has_permission(self, request, view):
        if len(Session.objects.get_queryset().filter(active=True)) == 1:
            return True
        else:
            raise PermissionDenied({"message": "No Sessions Open"})


class ServerTime(View):
    """
{"time":"15:52:40","status":"non","sess":2,"MaxIDs":"0"}
    """

    def get(self, request):
        status = False
        if len(Session.objects.get_queryset().filter(active=True)) == 1:
            status = True
        return JsonResponse({'time': datetime.datetime.now().replace(microsecond=0), 'status': status})


class GetMyImage(APIView):
    # permission_classes = (SessionOpenPermission,)

    def get(self, request, format=None):
        dir = os.getcwd() + '/backend/captcha_images/clean/'
        image = random.choice(os.listdir(dir))
        image_name = image.split('.')[0]
        print(image_name)
        request.user.profile.captcha = image_name
        request.user.profile.save()
        with open(dir + image, 'rb') as fh:
            return HttpResponse(fh.read(), content_type='image/png')


class SubmitBid(APIView):
    # permission_classes = (SessionOpenPermission,)

    def post(self, request, format=None):
        print("RECIEVED POST THING")
        print("===============\n\n\n")
        print(request.data)
        print(request.user.profile.captcha)
        if request.data['mathcaptcha'] == request.user.profile.captcha:
            bid = Bid.objects.create(session=Session.objects.latest('time_start'),
                                     price=request.data['price'],
                                     quantity=request.data['rpower'],
                                     user=request.user)
            bid.save()
            return JsonResponse({'success': True, 'data': BidSerializer(bid).data})
        request.user.profile.captcha = None
        return JsonResponse({'success': False})


class LastSession(APIView):
    """
    This returns the serialized list of companies to which the user
    has permission, i.e. user checked against each company

    """

    def get(self, request):
        """
        Only returns the query set for said company
        :return:
        """
        queryset = Session.objects.latest('time_start')
        return JsonResponse(SessionSerializer(queryset).data)
        # return Company.objects.all()
