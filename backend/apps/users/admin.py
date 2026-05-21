from django.contrib import admin
from django.contrib.auth import get_user_model
from django.utils.html import format_html

User = get_user_model()


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'full_name', 'phone_number', 'hostel_name', 'listing_count', 'is_active', 'created_at']
    list_filter = ['is_active', 'hostel_name', 'created_at']
    search_fields = ['email', 'full_name', 'phone_number']
    ordering = ['-created_at']
    actions = ['ban_users', 'unban_users']

    def listing_count(self, obj):
        count = obj.products.count()
        if count > 20:
            return format_html('<span style="color:red;font-weight:bold">{} ⚠️</span>', count)
        return count
    listing_count.short_description = 'Listings'

    @admin.action(description='Ban selected users (deactivate)')
    def ban_users(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, f'{queryset.count()} users banned.')

    @admin.action(description='Unban selected users (reactivate)')
    def unban_users(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(request, f'{queryset.count()} users unbanned.')
