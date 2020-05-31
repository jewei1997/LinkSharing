from django.http import HttpResponse
from django.views.generic import ListView
from linklist.models import Link, LinkList
from django.template import loader


# Index view for list of link lists
def index(request):
    lists = LinkList.objects.all()
    template = loader.get_template('linklist/index.html')
    context = {
            'lists': lists,
    }
    return HttpResponse(template.render(context, request))


# Detail view for a list, which displays a list of links
def detail(request, linklist_id):
    # TODO: need to filter by linklist_id
    links = Link.objects.all()
    print(links)
    template = loader.get_template('linklist/detail.html')
    context = {
            'links': links,
    }
    return HttpResponse(template.render(context, request))

