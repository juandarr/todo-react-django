# Generated by Django 4.2.4 on 2023-09-27 22:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0017_alter_todo_list_alter_todo_priority'),
    ]

    operations = [
        migrations.AddField(
            model_name='todo',
            name='due_date',
            field=models.DateField(blank=True, null=True),
        ),
    ]
