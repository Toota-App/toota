from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from django.contrib import auth
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, force_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.sites.shortcuts import get_current_site
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.urls import reverse
from .models import Driver, User
from .utils import Util

class AdminUserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['email', 'full_name', 'phone_number', 'profile_picture', 'password', 'confirm_password']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    def validate(self, data):
        # Validate Password
        if data.get('password') != data.get('confirm_password'):
            raise serializers.ValidationError("Password do not match")

        # Validate email
        if not data.get('email'):
            raise serializers.ValidationError("Email is required")
        # Add additional validation for email format if needed

        # Validate full_name
        if not data.get('full_name'):
            raise serializers.ValidationError("Full name is required")

        # Validate phone_number
        if not data.get('phone_number'):
            raise serializers.ValidationError("Phone number is required")

        return super().validate(data)

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        return User.objects.create_superuser(**validated_data)


class UserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'phone_number',  'password', 'confirm_password']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    def validate(self, data):
        # Validate Password
        if data.get('password') != data.get('confirm_password'):
            raise serializers.ValidationError("Password do not match")

        # Validate email
        if not data.get('email'):
            raise serializers.ValidationError("Email is required")
        # Add additional validation for email format if needed

        # Validate full_name
        if not data.get('full_name'):
            raise serializers.ValidationError("Full name is required")

        # Validate phone_number
        if not data.get('phone_number'):
            raise serializers.ValidationError("Phone number is required")

        return super().validate(data)

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        return User.objects.create_user(**validated_data)

class UserProfileSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'phone_number','profile_picture']
        read_only_fields = ['id']

    def update(self, user, data):
        user.email = data.get('email', user.email)
        user.full_name = data.get('full_name', user.full_name)
        user.phone_number = data.get('phone_number', user.phone_number)
        user.profile_picture = data.get('profile_picture', profile_picture)
        return user



        
class DriverSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = Driver
        fields = ['id','email', 'full_name', 'phone_number', 'physical_address', 'vehicle_registration_no', 'vehicle_type', 'licence_no', 'identity_document', 'driver_licence', 'vehicle_registration','criminal_record_check','password', 'confirm_password']
        extra_kwargs = {
            'password': {'write_only': True}
        }
         
    def validate(self, attrs):
        
        if not attrs['full_name']:
            raise serializers.ValidationError(
                {"full_name": "Full name is requred"}
            )
       
        if Driver.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError(
                {"email": "Email is already in use"}
            )

        if Driver.objects.filter(full_name=attrs['full_name']).exists():
            raise serializers.ValidationError(
                    {"full_name": "Full name is already in use"}
            )
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match"}
            )
                
        if Driver.objects.filter(licence_no=attrs['licence_no']).exists():
            raise serializers.ValidationError(
                {'licence_no': 'Licence Number already exists'}
            )
            
        if Driver.objects.filter(vehicle_registration_no=attrs['vehicle_registration_no']).exists():
            raise serializers.ValidationError(
                {'vehichle_registration': 'Vehicle_Registration already exists'}
            )
        
        if not attrs['physical_address']:
            raise serializers.ValidationError(
                {'physical address': 'Physical Address is required'}
            )
            
        return super().validate(attrs)
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        return Driver.objects.create_driver(**validated_data)



            
class LoginUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255, min_length=8)
    password = serializers.CharField(max_length=68, min_length=8, write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password']

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = auth.authenticate(email=email, password=password)
        if not user:
            raise AuthenticationFailed('Invalid user, try again')
        if not user.is_active:
            raise AuthenticationFailed('Acount disabled, please contact admin')
        if not user.is_verified:
            raise AuthenticationFailed('Email not verified, please verify your account')
        refresh =  RefreshToken.for_user(user)
        data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
        return data
        return super().validate(attrs)



class LoginDriverSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255, min_length=8)
    password = serializers.CharField(max_length=68, min_length=8, write_only=True)

    class Meta:
        model = Driver
        fields = ['email', 'password']

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = auth.authenticate(email=email, password=password)
        if not user:
            raise AuthenticationFailed('Invalid user, try again')
        if not user.is_active:
            raise AuthenticationFailed('Acount disabled, please contact admin')
        if not user.is_verified:
            raise AuthenticationFailed('Email not verified, please verify your account')
        refresh =  RefreshToken.for_user(user)
        data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
        return data
        return super().validate(attrs)

class VerifyUserEmailSerializer(serializers.ModelSerializer):
    token = serializers.CharField(max_length=555)
    
    class Meta:
        model = User
        fields = ['token']
        
        

class VerifyDriverEmailSerializer(serializers.ModelSerializer):
    token = serializers.CharField(max_length=555)
    
    class Meta:
        model = Driver
        fields = ['token']
        

class ResetPasswordEmailRequestSerializer(serializers.Serializer):
    email=serializers.EmailField(min_length=8)
    redirect_url=serializers.CharField(max_length=500, required=False)

    class Meta:
        fields = ["email"]


class SetNewPasswordSerializer(serializers.Serializer):
    password=serializers.CharField(min_length=8, max_length=68, write_only=True)
    token=serializers.CharField(min_length=1, write_only=True)
    uidb64=serializers.CharField(min_length=1, write_only=True)

    class Meta:
        fields = ['password', 'token', 'uidb64']

    def validate(self, attrs):
        try:
            password = attrs.get('password')
            uidb64 = attrs.get('uidb64')
            token = attrs.get('token')
            id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed('The reset link is invalid', 401)
            user.set_password(password)
            user.save()
            return (user)
        except Exception as e:
             raise AuthenticationFailed('The reset link is invalid', 401)
        return super().validate(attrs)
    

class CheckDriverVerificationSerializer(serializers.Serializer):

    class Meta:
        model = Driver
        fields = ['id']

class LogoutSerializer(serializers.Serializer):
    
    def validate(self, data):
        self.token = data.get('refresh')
        return data

    def save(self, **kwargs):
        try:
            RefreshToken(self.token).blacklist()
        except TokenError:
            self.fail('bad token')

   
class DriverProfileSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField()
    
    class Meta:
        model = Driver
        fields = ['id', 'email', 'full_name', 'phone_number','profile_picture', 'vehicle_registration_no', 'vehicle_type']
        read_only_fields = ['id']

    def update(self, user, data):
        user.email = data.get('email', user.email)
        user.full_name = data.get('full_name', user.full_name)
        user.phone_number = data.get('phone_number', user.phone_number)
        user.profile_picture = data.get('profile_picture', profile_picture)
        user.vehicle_type = data.get('vehicle_type', vehicle_type)

        return user
