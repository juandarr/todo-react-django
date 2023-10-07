from django.shortcuts import render, redirect
from django.template import loader
from rest_framework import viewsets
from .models import Todo, List, User
from .serializers import TodoSerializer, ListSerializer, UserSerializer
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from django.contrib.auth import login, authenticate
from django.contrib import messages
from django.contrib.auth.forms import AuthenticationForm

from .forms import UserCreationForm

def todo(request):
    context = {
        'user': request.user
    }
    template = loader.get_template('index.html')
    return render(request, 'index.html', context)

class UserApiView(viewsets.ModelViewSet):
    queryset = User.objects.all() 
    serializer_class = UserSerializer
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return  User.objects.filter(pk=self.request.user.id)

class TodoApiView(viewsets.ModelViewSet):
    queryset = Todo.objects.all() 
    serializer_class = TodoSerializer
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def get_queryset(self):
        return self.request.user.todos.all()

class ListApiView(viewsets.ModelViewSet):
    queryset = List.objects.all() 
    serializer_class = ListSerializer
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def get_queryset(self):
        return self.request.user.lists.all()

def login_request(request):
	if request.method == "POST":
		form = AuthenticationForm(request, data=request.POST)
		if form.is_valid():
			username = form.cleaned_data.get('username')
			password = form.cleaned_data.get('password')
			user = authenticate(username=username, password=password)
			if user is not None:
				login(request, user)
				messages.success(request, f"You are now logged in as {username}.")
				return redirect("home")
			else:
				messages.error(request,"Invalid username or password.")
		else:
			messages.error(request,"Invalid username or password.")
	form = AuthenticationForm()
	return render(request=request, template_name="registration/login.html", context={"login_form":form})

def signup_request(request):
	if request.method == "POST":
		form = UserCreationForm(request.POST)
		if form.is_valid():
			user = form.save()
			login(request, user)
			messages.success(request, form )
			return redirect("login")
		else:
			password1 = form.cleaned_data.get('password1')
			password2 = form.cleaned_data.get('password2')
			if (password1 != password2):
				messages.error(request, "Unsuccesful registration. Passwords don't match")
			else:
				messages.error(request, "Unsuccessful registration. Invalid information.")
	form = UserCreationForm()
	return render (request=request, template_name="registration/signup.html", context={"signup_form":form})