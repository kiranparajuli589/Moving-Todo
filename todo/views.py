import decimal
import json

from django.core.serializers.json import DjangoJSONEncoder
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, render_to_response

# Create your views here.
from django.template.loader import render_to_string
from django.utils.safestring import mark_safe

from .models import Todo


def index(request):
    todo = Todo.objects.order_by('position')
    element_names_array = []
    for t in todo:
        element_names_array.append(str(t.element_title))
    print(element_names_array)
    context = {
        'elements_name_array': mark_safe(json.dumps(list(element_names_array), cls=DjangoJSONEncoder)),
        'todo_list': todo,
        'minimum': Todo.objects.count()+1
    }
    return render(request, 'todo/index.html', context)


def to_top(request):
    if request.method == "POST":
        pos = request.POST.get('position')
        t = Todo.objects.filter(position__lt=pos)
        ts = Todo.objects.get(position=pos)
        for todo in t:
            todo.position += 1
            todo.save()
        ts.position = 1
        ts.save()
        data = {
            'message': 'success'
        }
        return JsonResponse(data)
        # html = render_to_string('todo/index.html', {'todo_list': Todo.objects.order_by("position")})
        # return HttpResponse(html)
        # return render_to_response('todo/index.html', {'todo_list': Todo.objects.order_by("position")})


def to_bottom(request):
    if request.method == "POST":
        pos = request.POST.get('position')
        t = Todo.objects.filter(position__gt=pos)
        ts = Todo.objects.get(position=pos)
        total = Todo.objects.count()
        for todo in t:
            todo.position -= 1
            todo.save()
        ts.position = total
        ts.save()
        data = {
            'message': 'success',
            'total': total
        }
        return JsonResponse(data)


def to_up(request):
    if request.method == "POST":
        pos = request.POST.get('position')
        ts = Todo.objects.get(position=pos)
        ts1 = Todo.objects.get(position=int(pos)+1)
        # swapping position values
        ts.position, ts1.position = ts1.position, ts.position
        ts.save()
        ts1.save()
        data = {
            'message': 'success'
        }
        return JsonResponse(data)


def to_down(request):
    if request.method == "POST":
        pos = request.POST.get('position')
        ts = Todo.objects.get(position=pos)
        ts1 = Todo.objects.get(position=int(pos)-1)
        # swapping position values
        ts.position, ts1.position = ts1.position, ts.position
        ts.save()
        ts1.save()
        data = {
            'message': 'success'
        }
        return JsonResponse(data)


def todo_shift(request):
    if request.method == "POST":
        from_position = request.POST.get('from')
        to_position = request.POST.get('to')
        print(from_position)
        if from_position < to_position:
            t = Todo.objects.filter(position__gt=from_position, position__lte=to_position)
            ts = Todo.objects.get(position=from_position)
            ts.position = None
            for todo in t:
                todo.position -= 1
                todo.save()
            ts.position = to_position
            ts.save()
            data = {
                'message': 'success'
            }
            return JsonResponse(data)
        elif from_position > to_position:
            t = Todo.objects.filter(position__gte=to_position, position__lt=from_position)
            ts = Todo.objects.get(position=from_position)
            print(from_position)
            ts.position = None
            for todo in t:
                todo.position += 1
                print(todo.position)
                todo.save()
            ts.position = to_position
            print(ts.position)
            ts.save()
            print(ts.position)
            data = {
                'message': 'success'
            }
            return JsonResponse(data)
        elif from_position is to_position:
            data = {
                'message': 'equal'
            }
            return JsonResponse(data)


def todo_create(request):
    if request.method == 'POST':
        subject = request.POST.get('subject')
        content = request.POST.get('content')
        todo = Todo.objects.create(
            position=Todo.objects.count()+1,
            element_title=subject,
            content=content
        )
        data = {
            'position': todo.position
        }
        return JsonResponse(data)