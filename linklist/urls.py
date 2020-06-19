from django.urls import path

from . import views

urlpatterns = [
    path('', views.linklists, name='index'),
    path('<int:pk>/', views.linklist, name='detail'),
    path('users/', views.UserList.as_view()),
    path('users/<int:pk>/', views.UserDetail.as_view()),
]
