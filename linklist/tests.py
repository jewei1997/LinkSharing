# from django.test import TestCase
from linklist.models import Link, LinkList


def create_linklist(title, date_created):
    return LinkList.objects.create(title=title, date_created=date_created)


def create_link(title, link, date_added, linklist):
    return Link(title=title, link=link,
                date_added=date_added, linklist=linklist)
