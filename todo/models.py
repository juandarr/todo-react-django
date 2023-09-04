from django.db import models
from django.utils.timezone import now
from django.contrib.auth.models import User
from django.conf import settings

class List(models.Model):
    id = models.BigAutoField(primary_key=True,unique=True, blank=True)
    title = models.CharField(max_length=75)
    archived = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete =models.CASCADE, blank=True, null=True, related_name='lists')

    def __str__(self):
        return self.title

class Todo(models.Model):
    id = models.BigAutoField(primary_key=True,unique=True, blank=True)
    title = models.CharField(max_length=75)
    description = models.CharField(max_length=150, blank=True, default="")
    created_at = models.DateTimeField(editable=False, blank=True, default=now)
    complete = models.BooleanField(blank=True, default=False)

    PRIORITIES = (
        (0, 'Low'),
        (1, 'Medium'),
        (2, 'High')
    )
    priority = models.IntegerField(help_text='Task priority', blank=True,default=0)
    list = models.ForeignKey(List, on_delete=models.RESTRICT, blank=True, default=1)
    user = models.ForeignKey(User, on_delete= models.CASCADE, blank=True, null=True, related_name='todos')

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return self.title
