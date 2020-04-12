import pytz
from datetime import datetime
from django.db import models

KTM = pytz.timezone('Asia/Kathmandu')
NOW = KTM.localize(datetime.now())


class Todo(models.Model):
    element_title = models.CharField(max_length=255, null=False,  unique=True)
    content = models.TextField()
    position = models.IntegerField(unique=True)
    date_created = models.DateTimeField(auto_now_add=NOW)
