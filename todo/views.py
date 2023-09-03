from django.http import HttpResponse
from django.template import loader
from django.views.generic.base import TemplateView
from rest_framework import permissions, viewsets
from .models import Todo, List
from .serializers import TodoSerializer, ListSerializer

def todo(request):
    template = loader.get_template('index.html')
    return HttpResponse(template.render())

'''        
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
'''

class TodoApiView(viewsets.ModelViewSet):
    queryset = Todo.objects.all() 
    serializer_class = TodoSerializer
    #permission_classes = [permissions.IsAuthenticated]
    authentication_classes = []
    '''
    def get_queryset(self):
        return self.request.user.todos.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    '''
class ListApiView(viewsets.ModelViewSet):
    queryset = List.objects.all() 
    serializer_class = ListSerializer
    #permission_classes = [permissions.IsAuthenticated]
    authentication_classes = []
    '''
    def get_queryset(self):
        return self.request.user.lists.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    '''