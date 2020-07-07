from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from django.conf.urls import include

from . import views

urlpatterns = [
    path('', views.LinkListsView.as_view(), name='index'),
    path('<int:pk>/', views.LinkListView.as_view(), name='detail'),
]

urlpatterns = format_suffix_patterns(urlpatterns) # what does this do
