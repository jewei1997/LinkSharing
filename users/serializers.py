from django.contrib.auth.models import CustomUser
from rest_framework import serializers
from .models import LinkList

class CustomUserSerializer(serializers.ModelSerializer):
    linklists = serializers.PrimaryKeyRelatedField(many=True, queryset=LinkList.objects.all())

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'linklists']
