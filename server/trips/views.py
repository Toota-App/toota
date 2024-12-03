from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Trip, Payment
from authentication.models import Driver
from .serializers import TripSerializer, PaymentSerializer
from rest_framework import permissions
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from reportlab.pdfgen import canvas
from io import BytesIO
import logging
import calendar
from django.db.models import Count
from django.utils import timezone

logger = logging.getLogger(__name__)

class IsOwnerOrDriver(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        logger.debug(f"User: {request.user}, Driver: {obj.driver}")
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user or (obj.driver and obj.driver.user == request.user)

class TripListCreateView(generics.ListCreateAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TripRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    lookup_field = 'pk'
    permission_classes = [IsOwnerOrDriver]

    def get_queryset(self):
        return Trip.objects.all()

    def perform_update(self, serializer):
        serializer.save(driver=self.request.user.driver)

class TripRetrieveByDriverView(generics.ListAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        driver_id = self.kwargs['driver_id']
        return Trip.objects.filter(driver_id=driver_id)

class TripListView(generics.ListAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Trip.objects.order_by('-pickup_time')

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
    queryset = Trip.objects.all()

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
        return Trip.objects.filter(status='COMPLETED', pickup_time__month=month).count()

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

class DriverAcceptanceRateView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, driver_id):
        try:
            driver = Driver.objects.get(id=driver_id)
            total_trips = Trip.objects.filter(driver=driver).count()
            accepted_trips = Trip.objects.filter(driver=driver, status='ACCEPTED').count()
            acceptance_rate = (accepted_trips / total_trips) * 100 if total_trips > 0 else 0
            acceptance_rate = round(acceptance_rate, 2)  # Round to two decimal places
            return Response({'acceptance_rate': acceptance_rate}, status=status.HTTP_200_OK)
        except Driver.DoesNotExist:
            return Response({'detail': 'Driver not found.'}, status=status.HTTP_404_NOT_FOUND)
class DriverTotalTripsCompletedView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, driver_id):
        try:
            driver = Driver.objects.get(id=driver_id)
            total_trips = Trip.objects.filter(driver=driver).count()
            completed_trips = Trip.objects.filter(driver=driver, status='COMPLETED').count()
            total_trips_fraction = f"{completed_trips}/{total_trips}" if total_trips > 0 else "0/0"
            completion_percentage = (completed_trips / total_trips) * 100 if total_trips > 0 else 0
            rounded_completion_percentage = round(completion_percentage, 2)
            return Response({
                'total_trips_completed': total_trips_fraction,
                'completion_percentage': rounded_completion_percentage
            }, status=status.HTTP_200_OK)
        except Driver.DoesNotExist:
            return Response({'detail': 'Driver not found.'}, status=status.HTTP_404_NOT_FOUND)

class DriverDailyEarningsView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, driver_id, date):
        try:
            # Parse the date from the URL
            date = timezone.datetime.strptime(date, '%Y-%m-%d').date()
            
            # Calculate start and end of the day
            start_of_day = timezone.make_aware(timezone.datetime.combine(date, timezone.datetime.min.time()))
            end_of_day = timezone.make_aware(timezone.datetime.combine(date, timezone.datetime.max.time()))
            
            # Filter payments by driver and date
            payments = Payment.objects.filter(driver_id=driver_id, payment_date__range=(start_of_day, end_of_day))
            
            # Calculate total earnings before and after compensation
            total_earnings_before_compensation = sum(payment.amount_paid for payment in payments)
            total_compensation = total_earnings_before_compensation * 0.20  
            total_earnings_after_compensation = total_earnings_before_compensation - total_compensation
            
            response_data = {
                'driver_id': driver_id,
                'date': date,
                'total_earnings_before_compensation': str(total_earnings_before_compensation),
                'total_compensation': str(total_compensation),
                'total_earnings_after_compensation': str(total_earnings_after_compensation),
                'total_payments_count': payments.count(),
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
        except ValueError:
            return Response({'detail': 'Invalid date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)



class TripStatusView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]  # Only authenticated users can access this view

    def get(self, request, trip_id, *args, **kwargs):
        try:
            # Retrieve the trip by its UUID (primary key)
            trip = Trip.objects.get(id=trip_id)

            # Construct the response data
            trip_data = {
                "id": trip.id,
                "status": trip.status,
                "vehicle_type": trip.vehicle_type,
                "driver_name": trip.driver.user.full_name if trip.driver else None,  # Full name of the driver
                "user_name": trip.user.full_name if trip.user else None,  # Full name of the user
                "pickup_location": trip.pickup_location.location,
                "dropoff_location": trip.dropoff_location.location,
                "pickup_time": trip.pickup_time,
                "load_description": trip.load_description,
                "rating": trip.rating,
                "is_accepted": trip.is_accepted,
            }

            # Return the response
            return Response(trip_data, status=status.HTTP_200_OK)

        except Trip.DoesNotExist:
            # If the trip does not exist, return a 404 error
            return Response({"detail": "Trip not found."}, status=status.HTTP_404_NOT_FOUND)

