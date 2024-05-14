from rest_framework.authentication import BaseAuthentication
from django.contrib.auth import get_user_model
from .models import Driver

User = get_user_model()

class DriverAsUserAuthentication(BaseAuthentication):

	def authenticate(self, request):
		email = request.data.get('email')
		password = request.data.get('password')

		# First, check if a user with the given username/password exists
		user = User.objects.filter(email=email).first
		if user and user.check_password(password):
			return (user, None)

		# If no User found, check Driver model
        driver = Driver.objects.filter(email=username).first()
        if driver and driver.check_password(password):
            # Return the related User instance of the driver
        	return (driver.user if driver.user else None, None)
        return None