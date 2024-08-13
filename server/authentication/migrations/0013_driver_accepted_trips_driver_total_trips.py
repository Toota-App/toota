# Generated by Django 5.0.2 on 2024-08-02 00:20

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("authentication", "0012_driver_acceptance_rate"),
    ]

    operations = [
        migrations.AddField(
            model_name="driver",
            name="accepted_trips",
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name="driver",
            name="total_trips",
            field=models.PositiveIntegerField(default=0),
        ),
    ]
