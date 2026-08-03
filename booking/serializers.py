from rest_framework import serializers
from .models import Stylist, Hairstyle, HairstyleCategory, Appointment

class HairstyleCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = HairstyleCategory
        fields = ['id', 'name']

class HairstyleSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Hairstyle
        fields = ['id', 'name', 'description', 'category', 'category_name', 'hairstyle_image', 'price']

class StylistSerializer(serializers.ModelSerializer):
    styles = HairstyleSerializer(many=True, read_only=True)

    class Meta:
        model = Stylist
        fields = ['id', 'name', 'bio', 'location', 'travel_fee', 'rating', 'review_count', 'is_verified', 'profile_image', 'cover_image', 'styles']


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'
