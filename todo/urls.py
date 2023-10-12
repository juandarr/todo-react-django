from django.urls import path
from . import views
from rest_framework import routers

urlpatterns = [

    path('', views.todo, name="home"),
    path('api/status', views.online_status, name='online_status')
]
router = routers.DefaultRouter()
router.register('api/todos', views.TodoApiView, basename='TodoApi')
router.register('api/lists', views.ListApiView, basename='ListApi')
router.register('api/users', views.UserApiView, basename='UserApi')
urlpatterns += router.urls