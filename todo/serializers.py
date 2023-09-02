from rest_framework import serializers
from .models import Todo, List

class TodoSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField( read_only=True,
                                              default=serializers.CurrentUserDefault())
    priority = serializers.ChoiceField(choices=Todo.PRIORITIES)

    class Meta:
        model = Todo
        fields = ('id','title','description', 'created_at','complete',
                  'priority','list','user')

class ListSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField( read_only=True,
                                              default=serializers.CurrentUserDefault())
    class Meta:
        model = List
        fields = ('id','title','archived','user')