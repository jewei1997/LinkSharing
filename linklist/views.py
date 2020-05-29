from django.http import HttpResponse

# Create your views here.
def index(request):
    return HttpResponse("See a list of your links here")
