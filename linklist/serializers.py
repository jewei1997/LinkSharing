from rest_framework import serializers
from .models import LinkList, Link


class LinkListSerializer(serializers.ModelSerializer):
    class Meta:
        model = LinkList
        fields = ('pk', 'title', 'date_created', 'user')


class LinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Link
        fields = ('pk', 'title', 'link', 'date_added', 'linklist')
