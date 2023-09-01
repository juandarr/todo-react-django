from django.urls import path
from . import views
from rest_framework import routers

urlpatterns = [
    path('', views.todo, name='todo')
]

router = routers.DefaultRouter()
router.register('api/todos', views.TodoViewSet)
router.register('api/list', views.ListViewSet)
urlpatterns += router.urls