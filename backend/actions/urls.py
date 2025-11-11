from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ActionViewSet, TagViewSet

router = DefaultRouter()
router.register('actions', ActionViewSet, basename='action')
router.register('tags', TagViewSet, basename='tag')

urlpatterns = [
    path('', include(router.urls)),
]
