from django.urls import path
from .views import TripView

app_name = 'toota'

urlpatterns = [
    path('', TripView.as_view({'get': 'list'}), name='trip-list'),
    path('<uuid:trip_id>', TripView.as_view({'get': 'retrieve'}), name='trip-detail'),
]
