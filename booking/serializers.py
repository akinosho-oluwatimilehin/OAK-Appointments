from rest_framework import serializers
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
import os

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
        fields = [
            'id', 'name', 'bio', 'location', 'travel_fee', 
            'rating', 'review_count', 'is_verified', 
            'profile_image', 'cover_image', 'styles'
        ]


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'

    def create(self, validated_data):
        appointment = super().create(validated_data)

        # Context dict passed directly to the HTML template
        context = {
            'client_name': appointment.client_name,
            'hairstyle_name': appointment.hairstyle.name if appointment.hairstyle else 'Hair Service',
            'stylist_name': appointment.stylist.name if appointment.stylist else 'Assigned Stylist',
            'appointment_date': appointment.appointment_date.strftime('%B %d, %Y at %I:%M %p') if appointment.appointment_date else '',
            'client_address': appointment.client_address,
            'total_price': f"{appointment.hairstyle.price:,.2f}" if (appointment.hairstyle and appointment.hairstyle.price) else "0.00",
        }

        # Render HTML string and generate plain-text fallback
        html_content = render_to_string('emails/booking_confirmation.html', context)
        text_content = strip_tags(html_content)

        subject = f"Booking Confirmation: {context['hairstyle_name']} with {context['stylist_name']}"
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [appointment.client_email]

        # Construct multi-part message (Text + HTML)
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=from_email,
            to=recipient_list
        )
        email.attach_alternative(html_content, "text/html")

        try:
            email.send(fail_silently=True)
        except Exception as e:
            print(f"Failed to send HTML confirmation email: {e}")

        return appointment