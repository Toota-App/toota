from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin

from .models import User, Driver, PickupLocation, Trip 

# Register your models here.
admin.site.site_header = 'Toota Admin'
admin.site.site_title = 'Toota Admin Area'
admin.site.index_title = 'Welcome to Toota Admin Area'
@admin.register(User)
class UserAdmin(DefaultUserAdmin):
    
    list_display = ('email', 'full_name', 'phone_number', 'is_staff', 'is_active')
    ordering = ('email',)
    


@admin.register(Driver)
class DriverAdmin(admin.ModelAdmin):
    list_display = ('email', 'full_name', 'phone_number', 'physical_address', 'vehicle_registration', 'vehicle_type', 'licence_no', 'is_staff', 'is_active')
    ordering = ('email',)
    


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
