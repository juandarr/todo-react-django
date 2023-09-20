from django.db import models
from django.utils.timezone import now
from django.contrib.auth.models import User

class List(models.Model):
    id = models.BigAutoField(primary_key=True,unique=True, blank=True)
    title = models.CharField(max_length=75)
    archived = models.BooleanField(blank=True, default=False)
    user = models.ForeignKey(User, on_delete =models.CASCADE, blank=True, related_name='lists')

    def __str__(self):
        return self.title

class Todo(models.Model):
    id = models.BigAutoField(primary_key=True,unique=True, blank=True)
    title = models.CharField(max_length=75)
    description = models.CharField(max_length=150, blank=True, default="")
    created_at = models.DateTimeField(editable=False, blank=True, default=now)
    complete = models.BooleanField(blank=True, default=False)
    completed_at = models.DateTimeField(blank=True, null=True)
    priority = models.IntegerField(help_text='Task priority', blank=True,default=4)
    PRIORITIES = (
        (1, 'High'),
        (2, 'Medium'),
        (3, 'Low'),
        (4, 'None'),
    )

    list = models.ForeignKey(List, on_delete=models.CASCADE, blank=True, default=1)
    user = models.ForeignKey(User, on_delete= models.CASCADE, blank=True, related_name='todos')

    class Meta:
        ordering = ['created_at']

    def __init__(self, *args, **kwargs):
        super(Todo, self).__init__(*args, **kwargs)
        self._complete = self.complete

    def save(self, *args, **kwargs):
        if not self._complete and self.complete:
            self.completed_at = now()
        super(Todo, self).save(*args, **kwargs)

    def __str__(self):
        return self.title
