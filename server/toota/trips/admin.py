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
    fields = (
        'id', 
        'pickup_location', 
        'dropoff_location', 
        'driver',
        'vehicle_type', 
        'pickup_time', 
        'number_of_helpers',
        'load_description ',
        'status',
        'created',
        'updated', 
        'rating',
        'bid'
    )
    list_display = (
        'id', 'pickup_location','driver', 'status' , 'created', 'updated'
    
    )
    
    list_filter = (
        'status',
    )
    
    readonly_fields = (
        'id', 'created', 'updated'
    
    )

# Compare this snippet from server/toota/trips/urls.py:
