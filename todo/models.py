from django.db import models


class Todo(models.Model):
    element_title = models.CharField(max_length=255, null=False,  unique=True)
    content = models.TextField()
    position = models.IntegerField()

