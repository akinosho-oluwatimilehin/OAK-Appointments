from django.contrib import admin
from .models import Stylist, HairstyleCategory, Hairstyle, Appointment

@admin.register(Stylist)
class StylistAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'travel_fee', 'rating', 'review_count', 'is_verified')
    list_filter = ('is_verified', 'location')
    search_fields = ('name', 'location')

@admin.register(HairstyleCategory)
class HairstyleCategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Hairstyle)
class HairstyleAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'stylist', 'price')
    list_filter = ('category', 'stylist')
    search_fields = ('name', 'stylist__name')

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('stylist', 'hairstyle', 'client_name', 'appointment_date', 'status')
    list_filter = ('status', 'appointment_date')
    search_fields = ('client_name', 'client_email', 'client_phone')
    readonly_fields = ('created_at',)