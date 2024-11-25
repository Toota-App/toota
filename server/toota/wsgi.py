import os
from django.core.wsgi import get_wsgi_application

# Get the WEBSITE_HOSTNAME environment variable
website_hostname = os.getenv('WEBSITE_HOSTNAME')

# Decide which settings module to use based on WEBSITE_HOSTNAME
# settings_module = 'toota.deployment' if website_hostname else 'toota.settings'
settings_module = 'toota.settings'



# Set the DJANGO_SETTINGS_MODULE environment variable
os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_module)

# Optional debugging to verify hostname and settings
print(f"WEBSITE_HOSTNAME: {website_hostname}")
print(f"Using settings: {settings_module}")

# Set up the WSGI application
application = get_wsgi_application()