# Generated by Django 4.2.4 on 2025-03-21 17:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0011_alter_list_ordering'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='todo',
            options={'ordering': ['id']},
        ),
        migrations.RemoveField(
            model_name='todo',
            name='index',
        ),
    ]
