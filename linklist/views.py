from django.http import HttpResponse
from django.views.generic import ListView
from linklist.models import Link, LinkList
from django.template import loader


# Index view for list of link lists
def index(request):
    users_lists = request.user.linklist_set.all() if request.user.is_authenticated else []
    template = loader.get_template('linklist/index.html')
    context = {
            'lists': users_lists,
    }
    return HttpResponse(template.render(context, request))


# Detail view for a list, which displays a list of links
def detail(request, linklist_id):
    links = Link.objects.filter(linklist__id=linklist_id) if request.user.is_authenticated else []
    template = loader.get_template('linklist/detail.html')
    context = {
            'links': links,
    }
    return HttpResponse(template.render(context, request))

