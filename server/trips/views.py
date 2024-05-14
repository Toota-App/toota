# views.py
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

logger = logging.getLogger(__name__)


class IsOwnerOrDriver(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        logger.debug(f"User: {request.user}, Driver: {obj.driver}")
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user or obj.driver == request.user

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
    """
    TripListView - Gets all trips with counts of in progress and completed trips
    """
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filter the queryset by the latest trips based on pickup_time
        return Trip.objects.order_by('-pickup_time')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        # Count in progress and completed trips
        in_progress_count = queryset.filter(status='IN_PROGRESS').count()
        completed_count = queryset.filter(status='COMPLETED').count()
        
        return Response({
            "trips": serializer.data,
            "in_progress_count": in_progress_count,
            "completed_count": completed_count
        }, status=status.HTTP_200_OK)


class TripCompletedCountView(generics.GenericAPIView):
    """
    TripCompletedCountView - Gets the count of completed trips for each month
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        completed_trips_data = self.get_completed_trips_data()
        return Response(completed_trips_data, status=status.HTTP_200_OK)

    def get_completed_trips_data(self):
        completed_trips_data = []

        # Iterate through each month
        for month in range(1, 13):
            month_name = calendar.month_name[month]
            completed_trips_count = self.get_completed_trips_count(month)
            completed_trips_data.append({
                "month": month_name,
                "completed_trips_count": completed_trips_count
            })

        return completed_trips_data

    def get_completed_trips_count(self, month):
        # Get the count of completed trips for the given month
        completed_trips_count = Trip.objects.filter(
            status='COMPLETED',
            pickup_time__month=month
        ).count()
        return completed_trips_count


class PaymentListCreateAPIView(generics.ListCreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

class PaymentRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer