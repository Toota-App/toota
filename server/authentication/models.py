from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _
from .utils import VEHICLE_TYPES
from .managers import UserManager, DriverUserManager

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=12, unique=True)
    full_name = models.CharField(max_length=255, null=False, blank=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)
    profile_picture = models.ImageField(upload_to='static/media/profile_pictures', null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name', 'phone_number']
    objects = UserManager()

    @property
    def group(self):
        if self.groups.exists():
            return self.groups.first().name
        return None

    def __str__(self):
        return self.full_name

class Driver(User):
    acceptance_rate = models.FloatField(default=0.0)
    vehicle_registration_no = models.CharField(max_length=100, unique=True, null=False, blank=False, default='')
    vehicle_type = models.CharField(max_length=100, choices=VEHICLE_TYPES, null=False, blank=False, default='Bike')
    licence_no = models.CharField(max_length=100, unique=True, null=False, blank=False, verbose_name=_("Driver's Licence Number"), default='')
    physical_address = models.CharField(max_length=300, null=False, blank=False, default='')
    identity_document = models.FileField(upload_to='static/media/identity_document', null=True, blank=True)
    driver_licence = models.FileField(upload_to='static/media/driver_licence', null=True, blank=True)
    vehicle_registration = models.FileField(upload_to='static/media/vehicle_registration', null=True, blank=True)
    criminal_record_check = models.FileField(upload_to='static/media/criminal_record_check', null=True, blank=True)
    acceptance_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    total_trips = models.PositiveIntegerField(default=0)
    accepted_trips = models.PositiveIntegerField(default=0)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name', 'phone_number', 'physical_address', 'vehicle_registration', 'vehicle_type', 'licence_no', 'driver_licence']

    objects = DriverUserManager()
    
    @property
    def group(self):
        if self.groups.exists():
            return self.groups.first().name
        return None

    def __str__(self):
        return self.full_name

    def update_acceptance_rate(self):
        if self.total_trips > 0:
            self.acceptance_rate = (self.accepted_trips / self.total_trips) * 100
        else:
            self.acceptance_rate = 0.0
        self.save()

