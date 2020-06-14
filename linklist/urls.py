from django.urls import path

from . import views

urlpatterns = [
    path('', views.linklists, name='index'),
    path('<int:linklist_id>/', views.detail, name='detail'),
]
