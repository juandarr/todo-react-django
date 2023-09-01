from django.urls import path
from . import views
from rest_framework import routers

urlpatterns = [
    path('', views.todo, name='main view'),
    path('todos/api', views.TodoApiView.as_view()),
    path('lists/api', views.ListApiView.as_view())
]