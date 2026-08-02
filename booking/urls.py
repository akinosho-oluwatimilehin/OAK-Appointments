from django.urls import path, include
from rest_framework.routers import DefaultRouter
from.views import StylistViewSet, HairstyleCategoryViewSet, HairstyleViewSet, AppointmentViewSet

router = DefaultRouter()
router.register(r'stylists', StylistViewSet)
router.register(r'Categories', HairstyleCategoryViewSet)
router.register(r'Hairstyle', HairstyleViewSet)
router.register(r'Appointments', AppointmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]