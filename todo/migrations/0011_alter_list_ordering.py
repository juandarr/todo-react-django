# Generated by Django 4.2.4 on 2025-03-09 05:22

from django.db import migrations, models
import todo.models


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0010_list_ordering'),
    ]

    operations = [
        migrations.AlterField(
            model_name='list',
            name='ordering',
            field=models.JSONField(default=todo.models.default_order),
        ),
    ]
