from django.contrib.auth.models import BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email, phone_number, full_name, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email must be set')
        if not phone_number:
            raise ValueError('Phone number must be set')
        if not full_name:
            raise ValueError('Full Name must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, phone_number=phone_number, full_name=full_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, phone_number, full_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, phone_number, full_name, password, **extra_fields)
    
    
    
class DriverUserManager(BaseUserManager):
    def create_driver(self, email, phone_number, full_name, physical_address, vehicle_registration_no, vehicle_type, licence_no, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)
        driver = self.model(email=email, phone_number=phone_number, full_name=full_name, physical_address=physical_address, vehicle_registration_no=vehicle_registration_no, vehicle_type=vehicle_type, licence_no=licence_no, **extra_fields)
        extra_fields.setdefault('is_active', False)
        driver.set_password(password)
        driver.save(using=self._db)
        return driver
    
    
    
    