from django.urls import path
from . import views
from rest_framework import routers

urlpatterns = [

    path('', views.todo, name="home"),
]
router = routers.DefaultRouter()
router.register('api/todos', views.TodoApiView, basename='TodoApi')
router.register('api/lists', views.ListApiView, basename='ListApi')

urlpatterns += router.urls