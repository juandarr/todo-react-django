from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
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

from .forms import UserCreationForm
from django.dispatch import receiver
from .signals import user_created

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
		form = UserCreationForm(request.POST)
		print(request.POST, form.is_valid())
		if form.is_valid():
			username = form.cleaned_data.get('username')
			password1 = form.cleaned_data.get('password1')
			password2 = form.cleaned_data.get('password2')
			print(username, password1, password2)
			user = form.save()
			login(request, user)
			extra_data = {
				'timezone': request.POST.get('timezone')
			}
			user_created.send(sender=user, user=user, extra_data=extra_data)
			print("Now redirecting to a new place!")
			print("Where is the success message?")
			messages.success(request, f'User {username} was created succesfully')
			return HttpResponse()
		else:
			print("Running else branch")
			print(form.cleaned_data)
			username = request.POST.get('username')
			password1 = request.POST.get('password1')
			password2 = request.POST.get('password2')
			print(username, password1, password2)
			if User.objects.filter(username=username).exists():
				messages.error(request, "This username is already in use. Please choose another")
			elif (password1 != password2):
				print("this should trigger when passwords don't match")
				messages.error(request, "Unsuccesful registration. Passwords don't match")
			else:
				messages.error(request, "Unsuccessful registration. Invalid information")
	form = UserCreationForm()
	return render (request=request, template_name="registration/signup.html", context={"signup_form":form})

@receiver(user_created)
def user_created_handler(sender, **kwargs):
    '''
    Creates:
    - A new list associated to the new user, and its id 
    is stored as the inbox id for the new user
    - A new setting home_view with default value inbox id
    - A new setting timezone with empty value     
    '''
    user = kwargs['user']
    extra_data = kwargs['extra_data']
    from .models import List, Setting
	# Create and save default list: inbox
    new_model = List(title="📥 Inbox", user_id = user.id)
    new_model.save()

	# Update the related User model to establish the relationship with new List
    user.inbox_id = new_model.id
    user.save()

    new_setting = Setting(parameter="home_view", value=str(new_model.id), user_id = user.id)
    new_setting.save()

    new_setting = Setting(parameter="timezone", value=extra_data['timezone'], user_id = user.id)
    new_setting.save()

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
				return redirect('home')
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