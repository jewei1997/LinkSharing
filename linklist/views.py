from django.http import HttpResponse
from django.views.generic import ListView
from linklist.models import Link, LinkList
from django.template import loader

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from linklist.serializers import LinkListSerializer


# REST api stuff

@api_view(['GET', 'POST', 'DELETE'])
def linklists(request):
    """
    List the list of links a user has
    """
    if request.method == 'GET':
        data = request.user.linklist_set.all() if request.user.is_authenticated else []
        serializer = LinkListSerializer(data, context={'request': request}, many=True)
        return Response({'data': serializer.data})
    elif request.method == 'POST':
        serializer = LinkListSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        serializer = LinkListSerializer(data=request.data)
        serializer.delete()
        return Response(status=status.HTTP._204_NO_CONTENT)

"""
# Index view for list of link lists
def index(request):
    users_lists = request.user.linklist_set.all() if request.user.is_authenticated else []
    template = loader.get_template('linklist/index.html')
    context = {
            'lists': users_lists,
    }
    return HttpResponse(template.render(context, request))
"""


# Detail view for a list, which displays a list of links
def detail(request, linklist_id):
    links = Link.objects.filter(linklist__id=linklist_id) if request.user.is_authenticated else []
    template = loader.get_template('linklist/detail.html')
    context = {
            'links': links,
    }
    return HttpResponse(template.render(context, request))

