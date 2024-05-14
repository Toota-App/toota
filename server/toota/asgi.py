import os

from django.core.asgi import get_asgi_application
from django.urls import path

from channels.routing import ProtocolTypeRouter, URLRouter

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'toota.settings')

from toota.middleware import TokenAuthMiddlewareStack
from trips.consumers import TootaConsumer

application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': TokenAuthMiddlewareStack(
        URLRouter([
            path('toota/', TootaConsumer.as_asgi()),
        ])
    ),
})