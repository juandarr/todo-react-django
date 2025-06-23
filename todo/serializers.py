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
                  'completed_at','priority','due_date','all_day','list','user')

class ListSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField( read_only=True,
                                              default=serializers.CurrentUserDefault())
    class Meta:
        model = List
        fields = ('id','title','index','ordering','archived','user')

class SettingSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField( read_only=True,
                                              default=serializers.CurrentUserDefault())
    class Meta:
        model = Setting
        fields = ('id','parameter','value', 'user')

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password1 = serializers.CharField(required=True)
    new_password2 = serializers.CharField(required=True)

    def validate(self, data):
        if data['new_password1'] != data['new_password2']:
            raise serializers.ValidationError("The two password fields didn't match.")
        return data
