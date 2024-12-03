from django.urls import path
from .views import (
    TripListCreateView, 
    TripRetrieveUpdateDeleteView, 
    TripRetrieveByDriverView, 
    TripListView, 
    TripCompletedCountView, 
    PaymentListCreateAPIView, 
    PaymentRetrieveUpdateDestroyAPIView, 
    DriverAcceptanceRateView, 
    DriverTotalTripsCompletedView, 
    DriverDailyEarningsView,
    TripStatusView,

)

app_name = 'trip'

urlpatterns = [
    path('', TripListCreateView.as_view(), name='trip-list-create'),
    path('<uuid:pk>/', TripRetrieveUpdateDeleteView.as_view(), name='trip-retrieve-update-delete'),
    path('driver/<int:driver_id>/', TripRetrieveByDriverView.as_view(), name='trip-retrieve-by-driver'),
    path('all/', TripListView.as_view(), name='all-trips'),
    path('completed/', TripCompletedCountView.as_view(), name='completed-trips'),
    path('payments/', PaymentListCreateAPIView.as_view(), name='payment-list-create'),
    path('payments/<uuid:pk>/', PaymentRetrieveUpdateDestroyAPIView.as_view(), name='payment-detail'),
    path('driver/<int:driver_id>/acceptance_rate/', DriverAcceptanceRateView.as_view(), name='driver-acceptance-rate'),
    path('driver/<int:driver_id>/total_trips_completed/', DriverTotalTripsCompletedView.as_view(), name='driver-total-trips-completed'),
    path('driver/<int:driver_id>/earnings/<str:date>/', DriverDailyEarningsView.as_view(), name='driver-daily-earnings'),
    path('trip/<uuid:trip_id>/status/', TripStatusView.as_view(), name='trip-status'),
]



