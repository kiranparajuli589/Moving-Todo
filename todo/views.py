import json
from django.core.serializers.json import DjangoJSONEncoder
from django.db.utils import IntegrityError
from django.http import JsonResponse
from django.shortcuts import render
from django.http import QueryDict
from django.utils.safestring import mark_safe
from .models import Todo


def index(request):
    try:
        t = Todo.objects.create(position=1,
                                element_title="Sample Todo 1",
                                content="This is a sample todo")
    except IntegrityError:
        pass
    todo = Todo.objects.order_by('position')
    element_names_array = []
    for t in todo:
        element_names_array.append(str(t.element_title))
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
        ts1 = Todo.objects.get(position=int(pos)-1)
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
        print(pos)
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


def todo_shift(request):
    if request.method == "POST":
        from_position = request.POST.get('from')
        to_position = request.POST.get('to')
        if int(from_position) < int(to_position):
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
        elif int(from_position) > int(to_position):
            t = Todo.objects.filter(position__gte=to_position, position__lt=from_position)
            ts = Todo.objects.get(position=from_position)
            ts.position = None
            for todo in t:
                todo.position += 1
                todo.save()
            ts.position = to_position
            ts.save()
            data = {
                'message': 'success'
            }
            return JsonResponse(data)
        elif int(from_position) is int(to_position):
            data = {
                'message': 'equal'
            }
            return JsonResponse(data)


def todo_create(request):
    if request.method == 'POST':
        subject = request.POST.get('subject')
        content = request.POST.get('content')
        try:
            todo = Todo.objects.create(
                position=Todo.objects.count() + 1,
                element_title=subject,
                content=content
            )
            todo.save()
            data = {
                'code': 201,
                'status': 'OK',
                'message': 'unique',
                'subject': subject,
                'content': content,
                'id': todo.id
            }
        except IntegrityError:
            data = {
                'message': 'non-unique'
            }
        return JsonResponse(data)


def todo_edit(request, pk):
    if request.method == 'PATCH':
        subject = QueryDict(request.body).get('new_subject')
        content = QueryDict(request.body).get('new_content')
        try:
            todo = Todo.objects.get(pk=pk)
            todo.element_title = subject
            todo.content = content
            todo.save()
            data = {
                'code': 204,
                'status': 'OK',
                'message': 'Edit Success'
            }
        except Todo.DoesNotExist:
            data = {
                'message': 'Todo object with id {} does not exist!'.format(id)
            }
        except IntegrityError:
            data = {
                'message': 'non-unique'
            }
        return JsonResponse(data)


def todo_delete(request, pk):
    if request.method == 'DELETE':
        try:
            print(pk)
            todo = Todo.objects.get(pk=pk)
            position = todo.position
            todo.delete()
            data = {
                'code': 200,
                'status': 'OK',
                'position': position,
                'message': 'Delete Success'
            }
        except Todo.DoesNotExist:
            data = {
                'code': 404,
                'status': 'Failed',
                'message': 'Todo object with id {} does not exist!'.format(id)
            }
        return JsonResponse(data)
