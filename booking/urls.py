from django.urls import path, include
from rest_framework.routers import DefaultRouter
from.views import StylistViewSet, HairstyleCategoryViewSet, HairstyleViewSet, AppointmentViewSet

router = DefaultRouter()
router.register(r'stylists', StylistViewSet)
router.register(r'categories', HairstyleCategoryViewSet)
router.register(r'hairstyles', HairstyleViewSet)
router.register(r'appointments', AppointmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
