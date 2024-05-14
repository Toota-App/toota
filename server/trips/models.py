import uuid
from django.db import models
from django.urls import reverse
from authentication.models import Driver, User
from django.utils import timezone
from django.conf import settings
from datetime import datetime
VEHICLE_TYPES = (
        ('bike', 'Bike'),
        ('car', 'Car'),
        ('van', 'Van'),
        ('truck_1', '1 ton Truck'),
        ('truck_1.5', '1.5 ton Truck'),
        ('truck_2', '2 ton Truck'),
        ('truck_4', '4 ton Truck'),
    )
class Trip(models.Model):
    
    REQUESTED = 'REQUESTED'
    ACCEPTED = 'ACCEPTED'
    IN_PROGRESS = 'IN_PROGRESS'
    CANCELLED = 'CANCELLED'
    COMPLETED = 'COMPLETED'
    TRIP_STATUS = (
        (REQUESTED, 'REQUESTED'),
        (ACCEPTED, 'ACCEPTED'),
        (CANCELLED, 'CANCELLED'),
        (COMPLETED, 'COMPLETED'),
        (IN_PROGRESS, 'IN_PROGRESS')
    )
   
    id = models.UUIDField(primary_key=True, default=uuid.uuid4,  editable=False, unique=True)     
    created = models.DateTimeField(auto_now_add=True,)
    updated = models.DateTimeField(auto_now=True)
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    pickup_time = models.DateTimeField()
    dropoff_contact_number = models.CharField(max_length=20, null=True)
    load_description = models.TextField(blank=False, null=False, default='', max_length=500)
    driver = models.ForeignKey(
        settings.AUTH_DRIVER_MODEL,
        on_delete=models.DO_NOTHING,
        null=True,
        blank=True,
        related_name='trips_as_driver'
        
        )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.DO_NOTHING,
        null=True,
        blank=True,
        related_name='trips_as_user'
       
    )
    vehicle_type = models.CharField(max_length=100, choices=VEHICLE_TYPES, null=False, blank=False)
    status = models.CharField(max_length=100, choices=TRIP_STATUS, default=REQUESTED)
    rating = models.IntegerField(default=0)
    bid = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False, default=0.00)
    number_of_floors = models.IntegerField(default=0, null=False)
    is_accepted = models.BooleanField(default=False)

        
    def __str__(self):
        return f'{self.id}'
    
    def get_absolute_url(self):
        return reverse('trip:trip_detail', kwargs={'trip_id': self.id})
    
    
class Payment(models.Model):
    PAID = 'PAID'
    PENDING = 'PENDING'
    CANCELLED = 'CANCELLED'
    PAYMENT_STATUS = (
        (PAID, 'PAID'),
        (CANCELLED, 'CANCELLED'),
        (PENDING, 'PENDING')
    )
   

    id = models.UUIDField(primary_key=True, default=uuid.uuid4,  editable=False, unique=True)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='payment')
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, related_name='payments')
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default=PENDING)
    payment_date = models.DateTimeField(auto_now_add=True)
    order_number = models.CharField(max_length=8, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = get_random_string(length=8)
        super().save(*args, **kwargs)


    def __str__(self):
          return f"{self.id}"

