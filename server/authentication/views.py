import jwt
import os
from rest_framework import generics, status, views, permissions
from rest_framework_simplejwt.views import TokenObtainPairView as Token, TokenVerifyView
from rest_framework.response import Response
from .serializers import UserSerializer, LoginUserSerializer, DriverSerializer, VerifyUserEmailSerializer, VerifyDriverEmailSerializer, LoginDriverSerializer, ResetPasswordEmailRequestSerializer, SetNewPasswordSerializer, CheckDriverVerificationSerializer, UserProfileSerializer, AdminUserSerializer, LogoutSerializer, DriverProfileSerializer
from .models import  Driver, User
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from .utils import Util
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.conf import settings
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, force_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.shortcuts import redirect
from django.http import HttpResponsePermanentRedirect
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import redirect
from django.views import View
from django.http import HttpResponse

# Custom Redirect Frontend / mobile
class CustomRedirect(HttpResponsePermanentRedirect):

    allowed_schemes=[os.environ.get('APP_SCHEME'), 'http', 'https']

class AdminUserSignUpView(generics.GenericAPIView):
    serializer_class = AdminUserSerializer
    permission_classes = [AllowAny]
    
    def post(self, request):
        user = request.data
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        user_data = serializer.data
        user=User.objects.get(email=user_data['email'])

        token = RefreshToken.for_user(user).access_token
        current_site = get_current_site(request).domain
        relative_link = reverse('verify-user')
        abs_url = 'http://'+current_site+relative_link+"?token="+str(token)
        email_body=f'Hey {user.full_name} \nThank you for signing up for a Toota account, just one more step!\nFor security purposes, Please verify your email address using the link below \n {abs_url}'
        data={
            'email_body': email_body,
            'domain': abs_url, 
            'to_email': user.email,
            'email_subject': 'Please verify your Toota Account'}
        Util.send_email(data)
        return Response(user_data, status=status.HTTP_201_CREATED)


class UserListView(generics.ListAPIView):
    """
    UserListView - Gets all users saved
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser & IsAuthenticated]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        count = queryset.count()
        return Response({"count": count, "users": serializer.data}, status=status.HTTP_200_OK)



class DriverListView(generics.ListAPIView):
    """
    UserListView - Gets all users saved
    """
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    permission_classes = [permissions.IsAdminUser & IsAuthenticated]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        count = queryset.count()
        return Response({"count": count, "users": serializer.data}, status=status.HTTP_200_OK)


class UserSignUpView(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
    def post(self, request):
        user = request.data
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        user_data = serializer.data
        user=User.objects.get(email=user_data['email'])

        token = RefreshToken.for_user(user).access_token
        current_site = get_current_site(request).domain
        relative_link = reverse('verify-user')
        abs_url = 'http://'+current_site+relative_link+"?token="+str(token)
        email_body=f'Hey {user.full_name} \nThank you for signing up for a Toota account, just one more step!\nFor security purposes, Please verify your email address using the link below \n {abs_url}'
        data={
            'email_body': email_body,
            'domain': abs_url, 
            'to_email': user.email,
            'email_subject': 'Please verify your Toota Account'}
        Util.send_email(data)
        return Response(user_data, status=status.HTTP_201_CREATED)

class UserProfileView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated,]
    lookup_field = 'id'
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    
    def get(self, request, id):
        try: 
            user = User.objects.get(id=id)
            serializer = UserSerializer(user)

            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, id):
        try: 
            user = self.get_object()
            serializer = UserSerializer(user, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, id):
        try: 
            user = self.get_object()
            serializer = UserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)



class LoginUserView(Token):
    serializer_class = LoginUserSerializer
    permission_classes = [AllowAny]
    
    
class VerifyEmailUser(views.APIView):
    serializer_class = VerifyUserEmailSerializer
    permission_classes = [AllowAny]

    token_param_config=openapi.Parameter(
        'token', 
        in_=openapi.IN_QUERY, 
        description='Description',
        type=openapi.TYPE_STRING)
    @swagger_auto_schema(manual_parameters=[token_param_config])
    def get(self, request):
        token = request.GET.get('token')

        try:
            payload = AccessToken(token)
            user = User.objects.get(id=payload['user_id'])

            if not user.is_verified:
                user.is_verified = True
                user.save()

            return redirect('activation_success')
        except jwt.ExpiredSignatureError:
            return Response({'error': "Activation link expired"}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.exceptions.DecodeError:
            return Response({'error': "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

class ActivationSuccessView(View):
    def get(self, request):
        # Displaying account activation success message
        return HttpResponse("Your account has been successfully activated!")


class LoginDriverView(Token):
    serializer_class = LoginDriverSerializer
    permission_classes = [AllowAny]
    
    
class RequestUserPasswordResetEmail(generics.GenericAPIView):
    serializer_class = ResetPasswordEmailRequestSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        data = {'request': request, 'data': request.data}
        serializer = self.serializer_class(data=data)
        email = request.data['email']
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            current_site = get_current_site(request=request).domain
            relative_link = reverse('password-reset-confirm', kwargs={'uidb64': uidb64, 'token': token})
            redirect_url = 'http://localhost:5173/reset-password/'+uidb64+'/'+token
            email_body=f"Hey {user.full_name} \n\n It seems like you've requested a password reset for your Toota account no worries, we've got you covered!\nTo reset your password, please follow the link below:\n{redirect_url}\n\nIf you did not request this password reset, please ignore this email. Your account is secure, and no changes have been made.\n\nToota Support Team"
            data={
                'email_body': email_body,
                'domain': current_site, 
                'to_email': user.email,
                'email_subject': 'Reset your Password'
            }
            Util.send_email(data)
        return Response({'success': 'We have sent a link to reset your password'}, status=status.HTTP_200_OK)
    
class PasswordUserTokenCheck(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        try:
            id = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(id=id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

            return Response({'message': 'Credentials Valid', 'uidb64': uidb64, 'token': token}, status=status.HTTP_200_OK)

        except (ValueError, User.DoesNotExist, DjangoUnicodeDecodeError):
            return Response({'error': 'Invalid parameters'}, status=status.HTTP_400_BAD_REQUEST)

    

       
    
class DriverSignUpView(generics.GenericAPIView):
    serializer_class = DriverSerializer
    permission_classes = [AllowAny]
    
    def post(self, request):
        driver = request.data
        serializer = self.serializer_class(data=driver)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        driver_data = serializer.data
        
        driver=Driver.objects.get(email=driver_data['email'])

        token = RefreshToken.for_user(driver).access_token
        current_site = get_current_site(request).domain
        relative_link = reverse('verify-driver')
        abs_url = f'http://{current_site}{relative_link}?token={token}'
        email_body=f'Hey {driver.full_name} \n\nThank you for signing up for a Toota account, just one more step!.\n\nFor security purposes, Please verify your email address using the link below \n {abs_url}'
        data={
            'email_body': email_body,
            'domain': abs_url, 
            'to_email': driver.email,
            'email_subject': 'Please verify your Toota Account'}
        Util.send_email(data)
        return Response(driver_data, status=status.HTTP_201_CREATED)
    
class DriverProfileView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated,]
    lookup_field = 'id'
    queryset = Driver.objects.all()
    serializer_class = DriverProfileSerializer

    def get(self, request, id):
        try: 
            user = self.get_object()
            serializer =DriverSerializer(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, id):
        try: 
            user = self.get_object()
            serializer = DriverSerializer(user, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, id):
        try: 
            user = self.get_object()
            serializer = DriverSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    
class VerifyEmailDriver(views.APIView):
    serializer_class = VerifyDriverEmailSerializer
    permission_classes = [AllowAny]

    token_param_config=openapi.Parameter(
        'token', 
        in_=openapi.IN_QUERY, 
        description='Description',
        type=openapi.TYPE_STRING)
    @swagger_auto_schema(manual_parameters=[token_param_config])
    def get(self, request):
        token = request.GET.get('token')

        try:
            payload = AccessToken(token)
            user = Driver.objects.get(id=payload['user_id'])

            if not user.is_verified:
                user.is_verified = True
                user.save()

            return redirect('activation_success')
        except jwt.ExpiredSignatureError:
            return Response({'error': "Activation link expired"}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.exceptions.DecodeError:
            return Response({'error': "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
    


    
class RequestDriverPasswordResetEmail(generics.GenericAPIView):
    serializer_class = ResetPasswordEmailRequestSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        data = {'request': request, 'data': request.data}
        serializer = self.serializer_class(data=data)
        email = request.data['email']
        if Driver.objects.filter(email=email).exists():
            user = Driver.objects.get(email=email)
            uidb64 = urlsafe_base64_encode(smart_bytes(str(user.id)))
            token = PasswordResetTokenGenerator().make_token(user)
            current_site = get_current_site(request=request).domain
            relative_link = reverse('password-reset-confirm', kwargs={'uidb64': uidb64, 'token': token})
            redirect_url = 'http://localhost:5173/driver-reset-password/'+uidb64+'/'+token
            email_body=f"Hey {user.full_name} \n\n It seems like you've requested a password reset for your Toota account no worries, we've got you covered!\nTo reset your password, please follow the link below:\n{redirect_url}\n\nIf you did not request this password reset, please ignore this email. Your account is secure, and no changes have been made.\n\nToota Support Team"
            data={
                'email_body': email_body,
                'domain': current_site,
                'to_email': user.email,
                'email_subject': 'Reset your Password'
            }
            Util.send_email(data)
        return Response({'success': 'We have sent a link to reset your password'}, status=status.HTTP_200_OK)



class PasswordDriverTokenCheck(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        try:
            id = urlsafe_base64_decode(uidb64).decode()
            driver = Driver.objects.get(id=id)

            if not PasswordResetTokenGenerator().check_token(driver, token):
                return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

            return Response({'message': 'Credentials Valid', 'uidb64': uidb64, 'token': token}, status=status.HTTP_200_OK)

        except (ValueError, Driver.DoesNotExist, DjangoUnicodeDecodeError):
            return Response({'error': 'Invalid parameters'}, status=status.HTTP_400_BAD_REQUEST)


class CheckDriverVerification(generics.GenericAPIView):
    lookup_field = 'id'
    queryset = Driver.objects.all()
    serializer_class = CheckDriverVerificationSerializer
    
    permission_classes = [AllowAny]
    
    def get(self, request, id):
        try:
            driver = Driver.objects.get(id=id)

            if driver:
                if driver.identity_document and driver.drivers_license and driver.vehicle_registration and driver.criminal_record_check:
                    return Response({"verified": True})
                else:
                    return Response({"verified:": False})
        except Driver.DoesNotExist:
            return Response({"error": "Driver not found"}, status=status.HTTP_404_NOT_FOUND)



class SetNewPasswordAPIVIew(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer
    permission_classes = [AllowAny]

    def patch(self, request):
        serializer=self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'sucess': True, 'message': 'Password reset success'}, status=status.HTTP_200_OK)
 

class LogoutView(generics.GenericAPIView):
    serializer_class = LogoutSerializer
    permission_classes = [IsAuthenticated,]

    def post(self, request):
        serializer=self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(status = status.HTTP_204_NO_CONTENT)
