from django.dispatch import Signal
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import List

user_created = Signal()

@receiver(post_save, sender=List)
def set_position_to_id(sender, instance, created, **kwargs):
    if created:
        # Set index to id after the item is created
        instance.index = instance.id
        instance.save()