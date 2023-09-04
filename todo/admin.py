from django.contrib import admin
from .models import List, Todo

# Register your models here.
@admin.register(Todo)
class TodoAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "description",
                    "complete","created_at","priority",
                    "list","user"]

@admin.register(List)
class ListAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "archived","user"]