import os
from django.core.wsgi import get_wsgi_application

# Set the default settings module based on the environment
# Use 'production' settings if the PRODUCTION environment variable is set to 'true'
settings_module = "toota.settings.production" if os.getenv("PRODUCTION") == "true" else "toota.settings.development"
os.environ.setdefault("DJANGO_SETTINGS_MODULE", settings_module)

application = get_wsgi_application()