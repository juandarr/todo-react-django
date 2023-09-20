# Generated by Django 4.2.4 on 2023-09-20 04:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0016_todo_completed_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='todo',
            name='list',
            field=models.ForeignKey(blank=True, default=1, on_delete=django.db.models.deletion.CASCADE, to='todo.list'),
        ),
        migrations.AlterField(
            model_name='todo',
            name='priority',
            field=models.IntegerField(blank=True, default=4, help_text='Task priority'),
        ),
    ]
