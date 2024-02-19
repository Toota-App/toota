from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin

from .models import User, Driver, PickupLocation, Trip 

# Register your models here.

@admin.register(User)
class UserAdmin(DefaultUserAdmin):
    pass

@admin.register(Driver)
class DriverAdmin(admin.ModelAdmin):
    pass

@admin.register(PickupLocation)
class PickupLocationAdmin(admin.ModelAdmin):
    pass

@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    pass

# Compare this snippet from server/toota/trips/urls.py:
