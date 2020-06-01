from django.db import models


class Link(models.Model):
    title = models.CharField(max_length=200)
    link = models.URLField(max_length=300)
    date_added = models.DateTimeField()

    def __str__(self):
        return self.link


class LinkList(models.Model):
    title = models.CharField(max_length=100)
    links = models.ManyToManyField(Link)

    def __str__(self):
        return self.title
