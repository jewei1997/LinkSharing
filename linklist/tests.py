from datetime import date
from linklist.models import Link, LinkList
from django.test import TestCase


def create_linklist(title, date_created):
    return LinkList.objects.create(title=title, date_created=date_created)


def create_link(title, link, date_added, linklist):
    return Link(title=title, link=link,
                date_added=date_added, linklist=linklist)

def test_hi():
    assert 3 + 1 == 4


class LinklistModelTests(TestCase):
    def test_create_linklist(self):
        title = "my list"
        date_created = date(2020, 6, 5)
        ll = create_linklist(title, date_created)
        assert ll.title == title
        assert ll.date_created == date_created
