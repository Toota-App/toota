from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Trip, Payment, Driver 
from .serializers import TripSerializer, PaymentSerializer
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from reportlab.pdfgen import canvas
from io import BytesIO
from django.conf import settings
import logging
import calendar

logger = logging.getLogger(__name__)

class IsOwnerOrDriver(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user or obj.driver.user == request.user

def send_trip_email(trip, recipient, template_name, subject):
    context = {
        'user_name': trip.user.full_name,
        'driver_name': trip.driver.full_name if trip.driver else '',
        'pickup_location': trip.pickup_location.location,
        'dropoff_location': trip.dropoff_location.location,
        'pickup_time': trip.pickup_time.strftime('%Y-%m-%d %H:%M'),
        'load_description': trip.load_description,
    }
    try:
        message = render_to_string(template_name, context)
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [recipient],
            fail_silently=False,
        )
        logger.info(f"Email sent to {recipient} with subject '{subject}'")
    except Exception as e:
        logger.error(f"Failed to send email to {recipient}: {e}")


class TripListCreateView(generics.ListCreateAPIView):
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        trip = serializer.save(user=self.request.user)
        # Send email to user
        send_trip_email(trip, trip.user.email, 'trips/email_templates/trip_created_user.html', 'Trip Created Successfully')
        # Send email to all drivers
        for driver in Driver.objects.all():
            send_trip_email(trip, driver.email, 'trips/email_templates/trip_created_driver.html', 'New Trip Request')
class TripRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrDriver]
    lookup_field = 'pk'

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user) | Trip.objects.filter(driver__user=self.request.user)

    def perform_update(self, serializer):
        trip = serializer.save(driver=self.request.user.driver)
        # Send email to user and driver about the status update
        send_trip_email(trip, trip.user.email, 'trip_status_update_user.html', 'Trip Status Updated')
        send_trip_email(trip, trip.driver.user.email, 'trip_status_update_driver.html', 'Trip Status Updated')


class TripRetrieveByDriverView(generics.ListAPIView):
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        driver_id = self.kwargs['driver_id']
        return Trip.objects.filter(driver_id=driver_id)

class TripListView(generics.ListAPIView):
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user).order_by('-pickup_time')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        in_progress_count = queryset.filter(status='IN_PROGRESS').count()
        completed_count = queryset.filter(status='COMPLETED').count()

        return Response({
            "trips": serializer.data,
            "in_progress_count": in_progress_count,
            "completed_count": completed_count
        }, status=status.HTTP_200_OK)

class TripCompletedCountView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TripSerializer

    def get(self, request, *args, **kwargs):
        completed_trips_data = self.get_completed_trips_data()
        return Response(completed_trips_data, status=status.HTTP_200_OK)

    def get_completed_trips_data(self):
        completed_trips_data = []

        for month in range(1, 13):
            month_name = calendar.month_name[month]
            completed_trips_count = self.get_completed_trips_count(month)
            completed_trips_data.append({
                "month": month_name,
                "completed_trips_count": completed_trips_count
            })

        return completed_trips_data

    def get_completed_trips_count(self, month):
        return Trip.objects.filter(
            user=self.request.user,
            status='COMPLETED',
            pickup_time__month=month
        ).count()

class PaymentListCreateAPIView(generics.ListCreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()

class PaymentRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

