from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
import random

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    DRIVER = 'driver'
    CLIENT = 'client'
    ROLE_CHOICES = [
        (DRIVER, 'Driver'),
        (CLIENT, 'Client')
    ]

    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=CLIENT)
    google_id = models.CharField(max_length=50, blank=True, null=True)  # For Google login
    apple_id = models.CharField(max_length=50, blank=True, null=True)  # For Apple login

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return f"{self.email} ({self.get_role_display()})"

class EmailVerification(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="email_verification")
    otp = models.CharField(max_length=4)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.otp:
            self.otp = f"{random.randint(1000, 9999)}"  # Generate a random 4-digit OTP
        super().save(*args, **kwargs)

    def __str__(self):
        return f"OTP for {self.user.email} - Verified: {self.is_verified}"

class DriverProfile(models.Model):
    BAKKIE = 'bakkie'
    ONE_TON_TRUCK = '1_ton_truck'
    TWO_TON_TRUCK = '2_ton_truck'
    FOUR_TON_TRUCK = '4_ton_truck'
    EIGHT_TON_TRUCK = '8_ton_truck'
    
    VEHICLE_TYPE_CHOICES = [
        (BAKKIE, 'Bakkie'),
        (ONE_TON_TRUCK, '1 Ton Truck'),
        (TWO_TON_TRUCK, '2 Ton Truck'),
        (FOUR_TON_TRUCK, '4 Ton Truck'),
        (EIGHT_TON_TRUCK, '8 Ton Truck'),
    ]

    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="driver_profile")
    vehicle_type = models.CharField(max_length=20, choices=VEHICLE_TYPE_CHOICES)
    license_number = models.CharField(max_length=20, unique=True)
    license_expiry_date = models.DateField()

    def __str__(self):
        return f"Driver Profile for {self.user.email} - Vehicle Type: {self.get_vehicle_type_display()}"

