from rest_framework import serializers
from .models import Todo, List

class TodoSerializer(serializers.ModelSerializer):
    list = serializers.PrimaryKeyRelatedField(
        read_only=True,
        default=1
    )
    priority = serializers.ChoiceField(choices=Todo.PRIORITIES)

    class Meta:
        model = Todo
        fields = ('id','title','description', 'created_at','complete',
                  'priority','list')

class ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = ('id','title','archived')