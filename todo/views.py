from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.template import loader
from rest_framework import viewsets
from .models import Todo, List, User, Setting
from .serializers import TodoSerializer, ListSerializer, UserSerializer, SettingSerializer
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from django.contrib.auth import login, authenticate, logout
from django.contrib import messages
from django.contrib.auth.forms import AuthenticationForm

from .forms import CustomUserCreationForm

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

class SettingApiView(viewsets.ModelViewSet):
    queryset = Setting.objects.all() 
    serializer_class = SettingSerializer
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def get_queryset(self):
        return self.request.user.settings.all()

def signup_request(request):
	print("Request received!")
	print(request)
	if request.method == "POST":
		form = CustomUserCreationForm(request.POST)
		print(request.POST, form.is_valid())
		if form.is_valid():
			username = form.cleaned_data.get('username')
			user = form.save()
			#login(request, user)
			messages.success(request, f'User {username} was created succesfully')
			return redirect("login")
		else:
			print("Running else branch")
			username = request.POST.get('username')
			password1 = form.cleaned_data.get('password1')
			password2 = form.cleaned_data.get('password2')
			print(username, password1, password2)
			if User.objects.filter(username=username).exists():
				messages.error(request, "This username is already in use. Please choose another")
			elif (password1 != password2):
				print("this should trigger when passwords don't match")
				messages.error(request, "Unsuccesful registration. Passwords don't match")
			else:
				messages.error(request, "Unsuccessful registration. Invalid information")
	form = CustomUserCreationForm()
	return render (request=request, template_name="registration/signup.html", context={"signup_form":form})

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
				messages.error(request,"Invalid username or password")
		else:
			messages.error(request,"Invalid username or password")
	form = AuthenticationForm()
	return render(request=request, template_name="registration/login.html", context={"login_form":form})

def logout_request(request):
	logout(request)
	messages.success(request, "You have successfully logged out")
	return redirect("home")

def online_status(request):
	status = "Online"
	data = {"status": status}
	return JsonResponse(data)