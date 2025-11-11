from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from actions.views import RegisterView, CustomTokenObtainPairView, CustomTokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='docs'),
    path('api/auth/register', RegisterView.as_view(), name='register'),
    path('api/auth/login', CustomTokenObtainPairView.as_view(), name='login'),
    path('api/auth/refresh', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include('actions.urls')),
]
