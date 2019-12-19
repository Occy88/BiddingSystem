from rest_framework import serializers
from .models import Bid, Session
from django.contrib.auth.models import Group
from django.conf import settings
from pydoc import locate

from guardian.shortcuts import assign_perm, remove_perm


class BidSerializer(serializers.ModelSerializer):
    # to work out all the fk relationships be clever about what to show...
    # perhaps nothing?
    # perhaps Groups?

    # shipment_sites = serializers.PrimaryKeyRelatedField(many=True, queryset=ShipmentSite.objects.all())
    class Meta:
        model = Bid
        fields = ('id','user', 'time', 'price', 'quantity')

    def create(self, validated_data):
        """
        Create and return a new `supplier` instance, given the validated data.
        """
        # validated_data.pop('shipments', None)
        bid = Bid.objects.create(**validated_data)
        return bid


class SessionSerializer(serializers.ModelSerializer):
    # to work out all the fk relationships be clever about what to show...
    # perhaps nothing?
    # perhaps Groups?

    # shipment_sites = serializers.PrimaryKeyRelatedField(many=True, queryset=ShipmentSite.objects.all())
    bid_set = BidSerializer(many=True)

    class Meta:
        model = Session
        fields = ('id', 'time_start' ,'active', 'bid_set')

    def create(self, validated_data):
        """
        Create and return a new `supplier` instance, given the validated data.
        """
        # validated_data.pop('shipments', None)
        bid = Bid.objects.create(**validated_data)
        return bid


class SessionSerializer(serializers.ModelSerializer):
    # to work out all the fk relationships be clever about what to show...
    # perhaps nothing?
    # perhaps Groups?

    # shipment_sites = serializers.PrimaryKeyRelatedField(many=True, queryset=ShipmentSite.objects.all())
    bid_set = BidSerializer(many=True)

    class Meta:
        model = Session
        fields = ('id', 'time_start', 'active', 'bid_set')

    def create(self, validated_data):
        """
        Create and return a new `supplier` instance, given the validated data.
        """
        # validated_data.pop('shipments', None)
        bid = Session.objects.create(**validated_data)
        return bid
