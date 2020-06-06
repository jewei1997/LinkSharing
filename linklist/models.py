from django.db import models
from django.conf import settings


class LinkList(models.Model):
    title = models.CharField(max_length=100)
    date_created = models.DateTimeField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, blank=True,
                             null=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class Link(models.Model):
    title = models.CharField(max_length=200)
    link = models.URLField(max_length=300)
    date_added = models.DateTimeField()
    linklist = models.ForeignKey(LinkList, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
