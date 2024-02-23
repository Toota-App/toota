import datetime
import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.shortcuts import reverse



from toota import settings


# Create your models here.
class User(AbstractUser):
    full_name = models.CharField(max_length=255, null=False, blank=False, default='Enter your full name')
    phone_number = models.CharField(max_length=20, null=False, blank=False, unique=True)
    email = models.EmailField(max_length=255, null=False, blank=False, unique=True)
    profile_picture = models.ImageField(upload_to='profile_pictures', blank=True, null=True, default='profile_pictures/default.jpg')
    address = models.CharField(max_length=255, blank=True, null=True)
    is_email_confirmed = models.BooleanField(default=False)
    
    
    def __str__(self):
        return self.username
    
    
    
class Driver(User):
    vehicle_reg_no = models.CharField(max_length=100, null=False, blank=False)
    drivers_license_no = models.CharField(max_length=100, null=False, blank=False)
    drivers_license = models.ImageField(upload_to='drivers_license/', default='drivers_license/default.jpg')
    
    def __str__(self):
        return self.username
    
    
class PickupLocation(models.Model):
    location = models.CharField(max_length=300, null=False, blank=False)
    phone_number = models.CharField(max_length=20, null=True, blank=False, unique=True)
    
    
    def __str__(self):
        return self.location
    
        
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
    VEHICLE_TYPES = (
        ('bike', 'Bike'),
        ('car', 'Car'),
        ('van', 'Van'),
        ('truck_1', '1 ton Truck'),
        ('truck_1.5', '1.5 ton Truck'),
        ('truck_2', '2 ton Truck'),
        ('truck_4', '4 ton Truck'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    pickup_location = models.CharField(max_length=300, null=False, blank=False)
    dropoff_location = models.ManyToManyField(PickupLocation, related_name='dropoff_location', blank=True)
    number_of_helpers = models.IntegerField(default=0)
    pickup_time = models.DateTimeField(default=datetime.datetime.now)
    load_description = models.TextField(blank=True, null=True, default='', max_length=500)
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE )
    vehicle_type = models.CharField(max_length=100, choices=VEHICLE_TYPES, null=False, blank=False)
    status = models.CharField(max_length=100, choices=TRIP_STATUS, default=REQUESTED)
    rating = models.IntegerField(default=0)
    bid = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False, default=0.00)
    number_floors = models.IntegerField(default=0)
    is_accepted = models.BooleanField(default=False)
    
    
    
    def __str__(self):
        return f'{self.id}'
    
    def get_absolute_url(self):
        return reverse('trip:trip_detail', kwargs={'trip_id': self.id})
    
    
class EmailVerificationToken(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)