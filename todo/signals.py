from django.dispatch import Signal
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import List, Todo

user_created = Signal()

@receiver(post_save, sender=List)
def set_list_index_to_id(sender, instance, created, **kwargs):
    if created:
        # Set index to id after the new List instance is created
        instance.index = instance.id
        instance.save()

@receiver(post_save, sender=Todo)
def set_todo_index_to_id(sender, instance, created, **kwargs):
    if created:
        # Set index to id after the new Todo instance is created
        instance.index = instance.id
        instance.save()