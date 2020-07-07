from django.urls import reverse_lazy
from django.views.generic.edit import CreateView
from rest_framework import generics
from .models import CustomUser
from .serializers import CustomUserSerializer

from .forms import CustomUserCreationForm


class UserListView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer


class UserDetailView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer


class SignUpView(CreateView):
    form_class = CustomUserCreationForm
    success_url = reverse_lazy('login')
    template_name = 'signup.html'
