# Generated by Django 5.0.2 on 2024-12-06 13:25

import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("authentication", "0013_driver_accepted_trips_driver_total_trips"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="DropoffLocation",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("location", models.CharField(max_length=255)),
                ("phone_number", models.CharField(max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name="PickupLocation",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("location", models.CharField(max_length=255)),
                ("phone_number", models.CharField(max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name="Trip",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                        unique=True,
                    ),
                ),
                ("created", models.DateTimeField(auto_now_add=True)),
                ("updated", models.DateTimeField(auto_now=True)),
                ("pickup_time", models.DateTimeField()),
                ("load_description", models.TextField(default="", max_length=500)),
                (
                    "vehicle_type",
                    models.CharField(
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
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("REQUESTED", "REQUESTED"),
                            ("ACCEPTED", "ACCEPTED"),
                            ("CANCELLED", "CANCELLED"),
                            ("COMPLETED", "COMPLETED"),
                            ("IN_PROGRESS", "IN_PROGRESS"),
                        ],
                        default="REQUESTED",
                        max_length=100,
                    ),
                ),
                ("rating", models.IntegerField(default=0)),
                (
                    "bid",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=10),
                ),
                ("number_of_floors", models.IntegerField(default=0)),
                ("is_accepted", models.BooleanField(default=False)),
                (
                    "driver",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        related_name="trips_as_driver",
                        to="authentication.driver",
                    ),
                ),
                (
                    "dropoff_location",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="dropoff_location",
                        to="trips.dropofflocation",
                    ),
                ),
                (
                    "pickup_location",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="pickup_location",
                        to="trips.pickuplocation",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        related_name="trips_as_user",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Payment",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                        unique=True,
                    ),
                ),
                ("amount_paid", models.DecimalField(decimal_places=2, max_digits=10)),
                (
                    "compensation_amount",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=10),
                ),
                (
                    "net_amount",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=10),
                ),
                (
                    "payment_status",
                    models.CharField(
                        choices=[
                            ("PAID", "PAID"),
                            ("CANCELLED", "CANCELLED"),
                            ("PENDING", "PENDING"),
                        ],
                        default="PENDING",
                        max_length=20,
                    ),
                ),
                ("payment_date", models.DateTimeField(auto_now_add=True)),
                (
                    "order_number",
                    models.CharField(blank=True, max_length=8, unique=True),
                ),
                (
                    "driver",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="payments",
                        to="authentication.driver",
                    ),
                ),
                (
                    "trip",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="payments",
                        to="trips.trip",
                    ),
                ),
            ],
        ),
    ]
