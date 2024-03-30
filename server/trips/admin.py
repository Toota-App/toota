from django.contrib import admin

from .models import Trip 


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    fields = (
        'id', 
        'pickup_location', 
        'dropoff_location', 
        'driver',
        'user',
        'vehicle_type', 
        'load_description',
        'status',
        'created',
        'updated', 
        'rating',
        'bid'
    )
    list_display = (
        'id', 
        'pickup_location', 
        'dropoff_location', 
        'driver',
        'user',
        'vehicle_type', 
        'load_description',
        'status',
        'created',
        'updated', 
        'rating',
        'bid'
    
    )
    
    list_filter = (
        'status',
    )
    
    readonly_fields = (
        'id', 'created', 'updated'
    
    )

