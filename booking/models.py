from django.db import models

# Create your models here.
class Stylist(models.Model):
    name = models.CharField(max_length=100)
    bio = models.CharField(blank=True, max_length=255)
    location = models.CharField(max_length=100)
    travel_fee = models.DecimalField(max_digits=9, decimal_places=3, default=0.00)
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=4.7)
    review_count = models.IntegerField(default=0)
    is_verified = models.BooleanField(default=True)
    profile_image = models.ImageField(upload_to='stylists/', null=True, blank=True)
    cover_image = models.ImageField(upload_to='stylists/cover/', null=True, blank=True)

    def __str__(self):
        return self.name

class HairstyleCategory(models.Model):
    name = models.CharField(max_length=70)

    class Meta:
        verbose_name_plural = "Hairstyle Categories"

    def __str__(self):
        return self.name

class Hairstyle(models.Model):
    name = models.CharField(max_length=70)
    description = models.TextField(blank=True)
    stylist = models.ForeignKey(Stylist, on_delete=models.CASCADE, related_name='styles')
    category = models.ForeignKey(HairstyleCategory, on_delete=models.SET_NULL, null=True, blank=True)
    hairstyle_image = models.ImageField(upload_to='hairstyles', null=True, blank=True)
    price = models.DecimalField(max_digits=9, decimal_places=2, default=0.00)
    

    def __str__(self):
        return f"{self.name} - {self.stylist.name}"

class Appointment(models.Model):
    status_choices = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]

    stylist = models.ForeignKey(Stylist, on_delete=models.CASCADE)
    hairstyle = models.ForeignKey(Hairstyle, on_delete=models.CASCADE)
    client_name = models.CharField(max_length=100)
    client_email = models.EmailField(max_length=100)
    client_phone = models.CharField(max_length=20)
    client_address = models.TextField()
    appointment_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=status_choices, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.client_name} - {self.hairstyle.name} ({self.appointment_date.strftime('%Y-%m-%d %I:%M %p')})"