from django.db import models
from django.utils.timezone import now
from django.contrib.auth.models import User

class List(models.Model):
    title = models.CharField(max_length=75)
    archived = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete =models.CASCADE, blank=True, null= True, related_name='lists')

    def __str__(self):
        return self.title

class Todo(models.Model):
    title = models.CharField(max_length=75)
    description = models.CharField(max_length=150, null=True, blank=True)
    created_at = models.DateTimeField(default=now, editable=False)
    complete = models.BooleanField(default=False)

    PRIORITIES = (
        ('l', 'Low'),
        ('m', 'Medium'),
        ('h', 'High')
    )
    priority = models.CharField(max_length=1,choices=PRIORITIES, help_text='Task priority', null=True, blank=True)
    list = models.ForeignKey(List, on_delete=models.RESTRICT, default=1)
    user = models.ForeignKey(User, on_delete= models.CASCADE, blank=True, null=True, related_name='todos')

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return self.title
