# Generated by Django 3.0.6 on 2020-05-30 02:18

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('linklist', '0004_auto_20200530_0205'),
    ]

    operations = [
        migrations.AlterField(
            model_name='link',
            name='link',
            field=models.URLField(max_length=300, validators=[django.core.validators.URLValidator()]),
        ),
    ]
