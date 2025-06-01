from django.urls import path
from . import views
from rest_framework import routers

urlpatterns = [

    path('', views.todo, name="home"),
    path('api/status', views.online_status, name='online_status'),
    path('api/password_change/', views.PasswordChangeApiView.as_view(), name='password_change_api'),
]
router = routers.DefaultRouter()
router.register('api/todos', views.TodoApiView, basename='TodoApi')
router.register('api/lists', views.ListApiView, basename='ListApi')
router.register('api/users', views.UserApiView, basename='UserApi')
router.register('api/settings', views.SettingApiView, basename='SettingApi')
urlpatterns += router.urls
