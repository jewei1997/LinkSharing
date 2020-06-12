import pytest
from datetime import date
from linklist.models import Link, LinkList


@pytest.fixture
def generic_linklist():
    title = "my list"
    date_created = date(2020, 6, 5)
    return LinkList(title=title, date_created=date_created)


@pytest.fixture
def generic_link(generic_linklist):
    title = "my link"
    link = "https://www.tesla.com/"
    date_added = date(2020, 6, 5)
    linklist = generic_linklist
    return Link(title=title, link=link, date_added=date_added, linklist=linklist)


class TestLinklistModel:
    def test_linklist_to_str(self, generic_linklist):
        assert generic_linklist.__str__() == "my list"

    def test_link_to_str(self, generic_link):
        assert generic_link.__str__() == "my link"
