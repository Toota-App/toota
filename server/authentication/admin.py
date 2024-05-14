from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin
from .models import User, Driver
admin.site.site_header = 'Toota Admin'
admin.site.site_title = 'Toota Admin Area'
admin.site.index_title = 'Welcome to Toota Admin Area'

@admin.register(User)
class UserAdmin(DefaultUserAdmin):
    
    list_display = ('id','email', 'full_name', 'phone_number', 'profile_picture', 'is_staff', 'is_active', 'created', 'updated', 'is_verified')
    ordering = ('full_name',)
    


@admin.register(Driver)
class DriverAdmin(DefaultUserAdmin):
    list_display = ('id', 'email', 'full_name', 'profile_picture', 'phone_number','physical_address', 'vehicle_registration_no', 'vehicle_type', 'licence_no', 'vehicle_registration', 'identity_document', 'criminal_record_check', 'driver_licence' )
    ordering = ('full_name',)
    
