# Generated by Django 3.0.6 on 2020-05-30 02:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('linklist', '0005_auto_20200530_0218'),
    ]

    operations = [
        migrations.AlterField(
            model_name='link',
            name='link',
            field=models.URLField(max_length=300),
        ),
    ]
