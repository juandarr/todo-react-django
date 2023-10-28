from django.db import models
from django.utils.timezone import now
from todo_react_django import settings
from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin
from django.db.models.signals import post_save
from django.dispatch import receiver

class UserManager(BaseUserManager):
    def create_user(self, password=None, **extra_fields):
        user = self.model(**extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(password = password, **extra_fields)

class User(AbstractUser, PermissionsMixin):
    inbox_id = models.IntegerField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    objects = UserManager()

    def __str__(self):
        return self.username

class List(models.Model):
    id = models.BigAutoField(primary_key=True,unique=True, blank=True)
    title = models.CharField(max_length=75)
    archived = models.BooleanField(blank=True, default=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete =models.CASCADE, blank=True, related_name='lists')

    def __str__(self):
        return self.title

class Todo(models.Model):
    id = models.BigAutoField(primary_key=True,unique=True, blank=True)
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=10000, blank=True, default="")
    created_at = models.DateTimeField(editable=False, blank=True, default=now)
    complete = models.BooleanField(blank=True, default=False)
    completed_at = models.DateTimeField(blank=True, null=True)
    priority = models.IntegerField(help_text='Task priority', blank=True,default=4)
    PRIORITIES = (
        (4, 'None'),
        (3, 'Low'),
        (2, 'Medium'),
        (1, 'High')
    )
    due_date = models.DateTimeField(blank=True, null=True)
    list = models.ForeignKey(List, on_delete=models.CASCADE, blank=True)
    user = models.ForeignKey(User, on_delete= models.CASCADE, blank=True, related_name='todos')

    def __str__(self):
        return self.title

    def __init__(self, *args, **kwargs):
        super(Todo, self).__init__(*args, **kwargs)
        self._complete = self.complete

    def save(self, *args, **kwargs):
        if not self._complete and self.complete:
            self.completed_at = now()
        super(Todo, self).save(*args, **kwargs)

    class Meta:
        ordering = ['created_at']

@receiver(post_save, sender=User)
def create_records(sender, instance, created, **kwargs):
    '''
    Creates:
    - A new list associated to the new user, and its id 
    is stored as the inbox id for the new user
    - A new setting home_view with default value inbox id
    - A new setting timezone with empty value     
    '''
    from .models import List, Setting
    if created:
        # Create and save default list: inbox
        new_model = List(title="📥 Inbox", user_id = instance.id)
        new_model.save()

        # Update the related User model to establish the relationship with new List
        instance.inbox_id = new_model.id
        instance.save()

        new_setting = Setting(parameter="home_view", value=str(new_model.id), user_id = instance.id)
        new_setting.save()

        new_setting = Setting(parameter="timezone", value="", user_id = instance.id)
        new_setting.save()

class Setting(models.Model):
    id = models.BigAutoField(primary_key=True,unique=True, blank=True)
    parameter = models.CharField(max_length=50)
    value = models.CharField(max_length=50)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete =models.CASCADE, blank=True, related_name='settings')

    def __str__(self):
        return self.parameter + ' : ' + self.value