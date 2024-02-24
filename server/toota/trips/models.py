import datetime
import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.shortcuts import reverse
from toota import settings
from .utils import VEHICLE_TYPES
from .manager import UserManager, DriverUserManager
from django.utils.translation import gettext_lazy as _

class User(AbstractBaseUser, PermissionsMixin):
    username= None
    email = models.EmailField(unique=True, null=False, blank=False, max_length=255)
    phone_number = models.CharField(max_length=20, unique=True)
    full_name = models.CharField(max_length=255, null=False, blank=False)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name', 'phone_number']

    def __str__(self):
        return self.email
    
    
class Driver(User):
    vehicle_registration = models.CharField(max_length=100, unique=True, null=False, blank=False, default='')
    vehicle_type = models.CharField(max_length=100, choices=VEHICLE_TYPES, null=False, blank=False, default='Bike')
    licence_no = models.CharField(max_length=100, unique=True, null=False, blank=False, verbose_name=_("Driver's Licence Number"), default='')
    physical_address = models.CharField(max_length=300, null=False, blank=False, default='')

    objects = DriverUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name', 'phone_number', 'physical_address', 'vehicle_registration', 'vehicle_type', 'licence_no']


    class Meta:
        verbose_name = 'Driver'
        verbose_name_plural = 'Drivers'
        
    def save(self, *args, **kwargs):
        self.is_staff = True  # Drivers are staff
        super().save(*args, **kwargs)
        
    def __str__(self):
        return self.email

    
    
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
    

    