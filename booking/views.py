from django.shortcuts import render
from rest_framework import viewsets
from .models import Stylist, Hairstyle, HairstyleCategory, Appointment
from .serializers import(HairstyleCategorySerializer, HairstyleSerializer, StylistSerializer, AppointmentSerializer)

class StylistViewSet(viewsets.ModelViewSet):
    queryset = Stylist.objects.all()
    serializer_class = StylistSerializer

class HairstyleCategoryViewSet(viewsets.ModelViewSet):
    queryset = HairstyleCategory.objects.all()
    serializer_class = HairstyleCategorySerializer

class HairstyleViewSet(viewsets.ModelViewSet):
    queryset = Hairstyle.objects.all()
    serializer_class = HairstyleSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer