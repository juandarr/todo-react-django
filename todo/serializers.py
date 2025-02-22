from rest_framework import serializers
from .models import Todo, List, User, Setting

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','username','email','first_name', 'last_name','inbox_id')

class TodoSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True,
                                              default=serializers.CurrentUserDefault())
    class Meta:
        model = Todo
        fields = ('id','title','description', 'created_at','complete',
                  'completed_at','priority','due_date','list','user')

class ListSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField( read_only=True,
                                              default=serializers.CurrentUserDefault())
    class Meta:
        model = List
        fields = ('id','title','index','archived','user')

class SettingSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField( read_only=True,
                                              default=serializers.CurrentUserDefault())
    class Meta:
        model = Setting
        fields = ('id','parameter','value', 'user')