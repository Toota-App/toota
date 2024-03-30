from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .managers import UserManager, DriverUserManager
from .utils import VEHICLE_TYPES
from django.utils.translation import gettext_lazy as _
from rest_framework_simplejwt.tokens import RefreshToken

class User(AbstractBaseUser, PermissionsMixin):
    username= None
    email = models.EmailField(unique=True, null=False, blank=False, max_length=255, db_index=True)
    phone_number = models.CharField(max_length=12, unique=True)
    full_name = models.CharField(max_length=255, null=False, blank=False)
    profile_picture = models.ImageField(upload_to='static/media/profile_pictures', null=True, blank=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now_add=True)
    is_email_confirmed = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)

    

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name', 'phone_number']
    objects = UserManager()

    @property
    def group(self):
        groups = self.groups.all()
        return groups[0].name if groups else None
    
    def __str__(self):
        return f'{self.id}'

    def get_full_name(self):
        return self.full_name
    
    def get_phone_number(self):
        return self.phone_number
    def get_id(self):
        return self.id


    
    

class Driver(User):
    username = None
    vehicle_registration_no = models.CharField(max_length=100, unique=True, null=False, blank=False, default='')
    vehicle_type = models.CharField(max_length=100, choices=VEHICLE_TYPES, null=False, blank=False, default='Bike')
    licence_no = models.CharField(max_length=100, unique=True, null=False, blank=False, verbose_name=_("Driver's Licence Number"), default='')
    physical_address = models.CharField(max_length=300, null=False, blank=False, default='')
    identity_document = models.FileField(upload_to='static/media/identity_document', null=True, blank=True)
    driver_licence  = models.FileField(upload_to='static/media/driver_licence', null=True, blank=True)
    vehicle_registration  = models.FileField(upload_to='static/media/vehicle_registration', null=True, blank=True)
    criminal_record_check = models.FileField(upload_to='static/media/criminal_record_check', null=True, blank=True)


    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name', 'phone_number', 'physical_address', 'vehicle_registration', 'vehicle_type', 'licence_no']

    objects = DriverUserManager()

    
        
    def save(self, *args, **kwargs):
        self.is_staff = True  # Drivers are staff
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f'{self.id}'

    def get_full_name(self):
        return self.full_name
    
    def get_phone_number(self):
        return self.phone_number
    def get_id(self):
        return self.id

    @property
    def group(self):
        groups = self.groups.all()
        return groups[0].name if groups else None
    

   
    
    
    
