from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import List, Todo, User, Setting

# Register your models here.
admin.site.register(User, UserAdmin)

@admin.register(Todo)
class TodoAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "description",
                    "complete","created_at","completed_at","priority", "due_date",
                    "list","user"]

@admin.register(List)
class ListAdmin(admin.ModelAdmin):
    list_display = ["id", "title","index", "ordering","archived","user"]

@admin.register(Setting)
class SettingAdmin(admin.ModelAdmin):
    setting_display = ["id", "parameter", "value","user"]