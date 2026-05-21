#!/usr/bin/env bash
# Build script for Render deployment
pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate

# Create superuser if not exists
python manage.py shell -c "
from apps.users.models import User
if not User.objects.filter(email='admin@hostelmart.com').exists():
    User.objects.create_superuser(email='admin@hostelmart.com', password='admin123', full_name='Admin', phone_number='9999999999')
    print('Superuser created')
else:
    print('Superuser already exists')
"
