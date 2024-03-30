from django.urls import path
from  . import views

urlpatterns = [
	path('user/sign_up/', views.UserSignUpView.as_view(), name='user-sign_up'),
	path('user/login/', views.LoginUserView.as_view(), name='user-login'),
    path('user/profile/<id>/', views.UserProfileView.as_view(), name='user-profile'),
    path('user/verify_email/', views.VerifyEmailUser.as_view(), name='verify-user'),
    path('user/password-reset/', views.RequestUserPasswordResetEmail.as_view(), name='password-reset-user'),
    path('user/password-reset/<uidb64>/<token>',views.PasswordUserTokenCheck.as_view(), name='password-reset-confirm'),
    path('user/confirm-password-reset/', views.SetNewPasswordAPIVIew.as_view(), name='confirm-password-reset'),
    path('activation/success/', views.ActivationSuccessView.as_view(), name='activation_success'),
    # path('user/logout/', views.LogoutUserView.as_view(), name='user-logout'),
    path('driver/sign_up/', views.DriverSignUpView.as_view(), name='driver-sign_up'),
    path('driver/login/', views.LoginDriverView.as_view(), name='driver-login'),
    path('driver/profile/<id>/', views.DriverProfileView.as_view(), name='driver-profile'),
    path('driver/verify_email/', views.VerifyEmailDriver.as_view(), name='verify-driver'),
    path('driver/password-reset/', views.RequestDriverPasswordResetEmail.as_view(), name='password-reset-driver'),
    path('driver/verification-check/', views.CheckDriverVerification.as_view(), name='driver_document-check'),
    path('driver/password-reset/<uidb64>/<token>/',views.PasswordDriverTokenCheck.as_view(), name='password-reset-confirm'),
    # path('driver/confirm-password-reset/', views.SetNewPasswordAPIVIew.as_view(), name='confirm-password-reset'),
    # path('driver/logout/', views.LogoutDriverView.as_view(), name='driver-logout'),
]
