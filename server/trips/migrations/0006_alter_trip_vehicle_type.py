# Generated by Django 5.0.2 on 2024-06-26 00:45

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("trips", "0005_alter_trip_vehicle_type"),
    ]

    operations = [
        migrations.AlterField(
            model_name="trip",
            name="vehicle_type",
            field=models.CharField(
                choices=[
                    ("bakkie", "bakkie"),
                    ("truck_1", "1 ton Truck"),
                    ("truck_1.5", "1.5 ton Truck"),
                    ("truck_2", "2 ton Truck"),
                    ("truck_4", "4 ton Truck"),
                    ("truck_8", "8 ton Truck"),
                ],
                max_length=100,
            ),
        ),
    ]
