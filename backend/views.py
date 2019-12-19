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
from .helper import query_to_dict_clean
from .serializers import BidSerializer, SessionSerializer


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
        dir = os.getcwd() +\
              '/backend/captcha_images/kazaK/'
        image = random.choice(os.listdir(dir))
        image_name = image.split('.')[0]
        request.user.profile.captcha = image_name

        print(image_name)
        with open(dir + image, 'rb') as fh:
            return HttpResponse(fh.read(), content_type='image/png')


class SubmitBid(APIView):
    permission_classes = (SessionOpenPermission,)

    def post(self, request, format=None):
        print(request.data)
        if request.data['captcha'] == request.user.profile.captcha:
            bid = Bid.objects.create(price=request.data['price'], quantity=request.data['quantity'])

            return JsonResponse({'success': True, 'data': bid})
        request.user.profile.captcha = None
        return JsonResponse({'success': False})


class LastSession(generics.GenericAPIView):
    """
    This returns the serialized list of companies to which the user
    has permission, i.e. user checked against each company

    """

    def get(self,request):
        """
        Only returns the query set for said company
        :return:
        """
        queryset = Session.objects.latest('time_start')
        ser=SessionSerializer(queryset)

        return JsonResponse(ser.data)
        # return Company.objects.all()


class BidList(generics.ListCreateAPIView):
    """
    This returns the serialized list of companies to which the user
    has permission, i.e. user checked against each company

    """
    serializer_class = BidSerializer

    def get_queryset(self):
        """
        Only returns the query set for said company
        :return:
        """
        queryset = Session.objects.latest('time_start').bid_set
        print(queryset)
        print("-----------------------")
        return queryset
        # return Company.objects.all()
