from django.db import models
from django.contrib.auth.models import AbstractUser
from toota import settings
import uuid

# Create your models here.
class User(AbstractUser):
    first_name = models.CharField(max_length=100, null=False, blank=False)
    last_name = models.CharField(max_length=100, null=False, blank=False)
    phone_number = models.CharField(max_length=20, null=False, blank=False, unique=True)
    email = models.EmailField(max_length=255, null=False, blank=False, unique=True)
    profile_picture = models.ImageField(upload_to='profile_pictures', blank=True, null=True, default='profile_pictures/default.jpg')
    address = models.CharField(max_length=255, blank=True, null=True)
    
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
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    pickup_location = models.CharField(max_length=300, null=False, blank=False)
    dropoff_location = models.ManyToManyField(PickupLocation)
    # user_requested = models.ForeignKey(User, on_delete=models.CASCADE)  
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    vehicle_type = models.CharField(max_length=100, choices=VEHICLE_TYPES, null=False, blank=False)
    status = models.CharField(max_length=100, choices=TRIP_STATUS, default=REQUESTED)
    rating = models.IntegerField(default=0)
    
    
    