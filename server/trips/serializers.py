from rest_framework import serializers
from django.utils import timezone
from .models import Trip, Payment, PickupLocation, DropoffLocation
from authentication.serializers import UserSerializer, DriverSerializer
import logging
import re

logger = logging.getLogger(__name__)

class PhoneNumberValidatorMixin:
    def validate_phone(self, phone_number):
        if phone_number is None or len(phone_number) != 10 or not phone_number.startswith('0'):
            logger.warning("Invalid phone number format.")
            raise serializers.ValidationError("Phone number must start with '0' and be exactly 10 digits long.")

class PickupLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PickupLocation
        fields = '__all__'

class DropoffLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = DropoffLocation
        fields = '__all__'

class TripSerializer(serializers.ModelSerializer, PhoneNumberValidatorMixin):
    pickup_location = PickupLocationSerializer()
    dropoff_location = DropoffLocationSerializer()

    class Meta:
        model = Trip
        fields = '__all__'
        read_only_fields = ('id', 'created', 'updated')

    def validate(self, data):
        # Validate the bid
        if data.get('bid') is not None and data['bid'] < 50:
            logger.warning("Bid amount too low.")
            raise serializers.ValidationError({"bid": "Bid amount must be at least 50."})

        # Validate the pickup time
        #if data.get('pickup_time') and data['pickup_time'] <= timezone.now():
            #logger.warning("Pickup time is in the past.")
            #raise serializers.ValidationError({"pickup_time": "Pickup time must be in the future."})

        # Validate number of floors
        if data.get('number_of_floors') is not None and data['number_of_floors'] < 0:
            logger.warning("Number of floors cannot be negative.")
            raise serializers.ValidationError({"number_of_floors": "Number of floors cannot be negative."})

        return data

    def create(self, validated_data):
        try:
            # Extract location data
            pickup_location_data = validated_data.pop('pickup_location')
            dropoff_location_data = validated_data.pop('dropoff_location')

            # Validate phone numbers in both pickup and dropoff locations
            self.validate_phone(pickup_location_data.get('phone_number'))
            self.validate_phone(dropoff_location_data.get('phone_number'))

            # Create the related location instances
            pickup_location = PickupLocation.objects.create(**pickup_location_data)
            dropoff_location = DropoffLocation.objects.create(**dropoff_location_data)

            # Create the Trip instance
            trip = Trip.objects.create(
                pickup_location=pickup_location, 
                dropoff_location=dropoff_location, 
                **validated_data
            )

            logger.info(f"Trip created successfully with ID: {trip.id}")
            return trip
        except Exception as e:
            logger.error(f"Error while creating trip: {str(e)}")
            raise serializers.ValidationError({"detail": "Error occurred during trip creation."})

    def update(self, instance, validated_data):
        try:
            # Extract the location data
            pickup_location_data = validated_data.pop('pickup_location', None)
            dropoff_location_data = validated_data.pop('dropoff_location', None)

            # Update PickupLocation fields if data is provided
            if pickup_location_data:
                # Validate phone number
                self.validate_phone(pickup_location_data.get('phone_number'))
                pickup_location = instance.pickup_location
                pickup_location.location = pickup_location_data.get('location', pickup_location.location)
                pickup_location.phone_number = pickup_location_data.get('phone_number', pickup_location.phone_number)
                pickup_location.save()

            # Update DropoffLocation fields if data is provided
            if dropoff_location_data:
                # Validate phone number
                self.validate_phone(dropoff_location_data.get('phone_number'))
                dropoff_location = instance.dropoff_location
                dropoff_location.location = dropoff_location_data.get('location', dropoff_location.location)
                dropoff_location.phone_number = dropoff_location_data.get('phone_number', dropoff_location.phone_number)
                dropoff_location.save()

            # Update trip fields
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()

            # Update driver's acceptance rate if status is updated to 'ACCEPTED'
            if instance.status == 'ACCEPTED' and instance.driver:
                instance.driver.update_acceptance_rate()

            logger.info(f"Trip updated successfully with ID: {instance.id}")
            return instance
        except Exception as e:
            logger.error(f"Error while updating trip: {str(e)}")
            raise serializers.ValidationError({"detail": "Error occurred during trip update."})
class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            'id', 'trip', 'driver', 'amount_paid', 
            'compensation_amount', 'net_amount', 
            'payment_status', 'payment_date', 'order_number'
        ]
        read_only_fields = ('id', 'payment_date', 'order_number')

    def create(self, validated_data):
        try:
            # Create and save Payment instance with calculated values
            payment = Payment(
                trip=validated_data.get('trip'),
                driver=validated_data.get('driver'),
                amount_paid=validated_data.get('amount_paid'),
                payment_status=validated_data.get('payment_status', Payment.PENDING)
            )

            payment.save()
            logger.info(f"Payment created successfully for trip: {payment.trip.id}")
            return payment
        except Exception as e:
            logger.error(f"Error while creating payment: {str(e)}")
            raise serializers.ValidationError({"detail": "Error occurred during payment creation."})

    def update(self, instance, validated_data):
        try:
            # Update Payment instance with validated data
            instance.trip = validated_data.get('trip', instance.trip)
            instance.driver = validated_data.get('driver', instance.driver)
            instance.amount_paid = validated_data.get('amount_paid', instance.amount_paid)
            instance.payment_status = validated_data.get('payment_status', instance.payment_status)

            # Calculate new compensation and net amounts
            instance.compensation_amount = instance.amount_paid * 0.20
            instance.net_amount = instance.amount_paid - instance.compensation_amount

            instance.save()
            logger.info(f"Payment updated successfully for trip: {instance.trip.id}")
            return instance
        except Exception as e:
            logger.error(f"Error while updating payment: {str(e)}")
            raise serializers.ValidationError({"detail": "Error occurred during payment update."})
