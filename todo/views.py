from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.views.generic.base import TemplateView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status, viewsets
from .models import Todo, List
from .serializers import TodoSerializer, ListSerializer

def todo(request):
    template = loader.get_template('index.html')
    return HttpResponse(template.render())

        
class TodoApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    # 1. List all
    def get(self, request, *args, **kwargs):
        todos = Todo.objects.filter(user = request.user.id)
        serializer_class = TodoSerializer(todos, many=True)
        return Response(serializer_class.data, status=status.HTTP_200_OK)

    #2. Create
    def post(self, request, *args, **kwargs):
        data = {
            'title': request.data.get('title'),
            'description': request.data.get('description'),
            'complete':request.data.get('complete'),
            'priority': request.data.get('priority'),
            'list': request.data.get('list')
        }
        serializer = TodoSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_201_CREATED)
        return Response(serializer.erros, status = status.HTTP_400_BAD_REQUEST)

class ListApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    # 1. List all
    def get(self, request, *args, **kwargs):
        lists = List.objects.filter(user = request.user.id)
        serializer_class = ListSerializer(lists, many=True)
        return Response(serializer_class.data, status=status.HTTP_200_OK)

    #2. Create
    def post(self, request, *args, **kwargs):
        data = {
            'title': request.data.get('title'),
            'archived': request.data.get('archived')
        }
        serializer = ListSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_201_CREATED)
        return Response(serializer.erros, status = status.HTTP_400_BAD_REQUEST)

class TodoView(TemplateView):
    template_name = '../templates/index.html'

    def get_context_data(self, **kwargs):
        return {
            'priority_choices': [
                {'id': c[0],
                 'name': c[1]} 
                 for c in Todo.PRIORITIES],
        }