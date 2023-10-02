from django.urls import path
from . import views
from rest_framework import routers

urlpatterns = [
    path('', views.todo, name='main view'),
    path(
        'signup', views.signup_request, name='signup'
    ),
]

router = routers.DefaultRouter()
router.register('api/todos', views.TodoApiView, basename='TodoApi')
router.register('api/lists', views.ListApiView, basename='ListApi')

urlpatterns += router.urls