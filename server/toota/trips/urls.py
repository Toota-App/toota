from django.urls import path

from trips.views import index


urlpatterns = [
    path('', index),
]