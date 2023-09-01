from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.views.generic.base import TemplateView
from rest_framework import viewsets
from .models import Todo, List
from .serializers import TodoSerializer, ListSerializer

def todo(request):
    template = loader.get_template('index.html')
    return HttpResponse(template.render())

        
class TodoViewSet(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    queryset = Todo.objects.all()

class ListViewSet(viewsets.ModelViewSet):
    serializer_class = ListSerializer
    queryset = List.objects.all()

class TodoView(TemplateView):
    template_name = '../templates/index.html'

    def get_context_data(self, **kwargs):
        return {
            'priority_choices': [
                {'id': c[0],
                 'name': c[1]} 
                 for c in Todo.PRIORITIES],
        }