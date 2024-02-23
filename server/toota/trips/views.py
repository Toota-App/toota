from django.contrib.auth import get_user_model
from rest_framework import generics
from rest_framework_simplejwt.views import TokenObtainPairView as Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import UserSerializer, LoginSerializer, TripSerializer
from .models import EmailVerificationToken, Trip
from .utils import send_confirmation_email
from rest_framework import viewsets
from rest_framework import permissions

class SignUpView(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    
class LoginView(Token):
    serializer_class = LoginSerializer
    
    
class TripView(viewsets.ReadOnlyModelViewSet):
    lookup_field = 'id'
    lookup_url_kwarg = 'trip_id'
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    
class UserInformationAPIView(APIView):
    permission_classes = [IsAuthenticated,]
    
    def get(self, request):
        user = request.user
        email = request.email
        is_email_confirmed = user.is_email_confirmed
        payload = {'email': email, 'is_email_confirmed': is_email_confirmed}
        return Response(payload, status=200)
    
    
class SendEmailConfirmationAPIView(APIView):
    permission_classes = [IsAuthenticated,] 
    def post(self, request, format=None):
        user = request.user
        token = EmailVerificationToken.objects.create(user=user)
        send_confirmation_email(email=user.email, token_id=token.id, user_id=user.id)
        return Response(data=None, status=201)

