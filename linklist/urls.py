from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from django.conf.urls import include

from . import views

urlpatterns = [
    path('', views.LinkListsView.as_view(), name='index'),
    path('<int:pk>/', views.LinkListView.as_view(), name='detail'),
    path('users/', views.UserList.as_view()),
    path('users/<int:pk>/', views.UserDetail.as_view()),
    path('api-auth/', include('rest_framework.urls')),
]

urlpatterns = format_suffix_patterns(urlpatterns) # what does this do
