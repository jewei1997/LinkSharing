from users.models import CustomUser
from django.http import HttpResponse
from django.views.generic import ListView
from linklist.models import Link, LinkList
from django.template import loader
from linklist.serializers import LinkListSerializer, LinkSerializer
from users.serializers import CustomUserSerializer
from django.http import Http404

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status, generics
from rest_framework.views import APIView


class LinkListsView(APIView):
    """
    Class-based view: List the list of links a user has
    """
    def get(self, request, format=None):
        linklists = LinkList.objects.all()
        serializer = LinkListSerializer(linklists, context={'request': request}, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = LinkListSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, format=None):
        linklist = LinkList.objects.get(pk=request.data['pk'])
        linklist.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class LinkListView(APIView):
    """
    Class-based view: Retrieve, update, or delete a LinkList instance
    """
    def get(self, request, pk, format=None):
        data = Link.objects.filter(linklist__id=pk)
        serializer = LinkSerializer(data, context={'request': request}, many=True)
        return Response(serializer.data)

    def post(self, request, pk, format=None):
        serializer = LinkSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        link = Link.objects.get(pk=request.data['pk'])
        link.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# some User views, following the tutorial
class UserList(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer


class UserDetail(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
