# Generated by Django 4.2.4 on 2023-09-04 02:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0011_alter_todo_complete'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='todo',
            name='user',
        ),
    ]