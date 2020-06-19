from django.contrib.auth.models import CustomUser
from django.http import HttpResponse
from django.views.generic import ListView
from linklist.models import Link, LinkList
from django.template import loader
from linklist.serializers import LinkListSerializer, LinkSerializer
from users.serializers import CustomUserSerializer

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status, generics


@api_view(['GET', 'POST', 'DELETE'])
def linklists(request):
    """
    List the list of links a user has
    """
    if request.method == 'GET':
        data = LinkList.objects.all()
        serializer = LinkListSerializer(data, context={'request': request}, many=True)
        return Response({'data': serializer.data})
    elif request.method == 'POST':
        serializer = LinkListSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        linklist = LinkList.objects.get(pk=request.data['pk'])
        linklist.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST', 'DELETE'])
def linklist(request, pk):
    """
    List the links in a linklist
    """
    if request.method == 'GET':
        data = Link.objects.filter(linklist__id=pk)
        serializer = LinkSerializer(data, context={'request': request}, many=True)
        return Response({'data': serializer.data})
    elif request.method == 'POST':
        serializer = LinkSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
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
