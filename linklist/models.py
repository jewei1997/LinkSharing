from django.db import models


class Link(models.Model):
    link = models.URLField(max_length=300)
    date_added = models.DateTimeField()


class LinkList(models.Model):
    title = models.CharField(max_length=100)
    links = models.ManyToManyField(Link)
