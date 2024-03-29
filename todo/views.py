import json

from django.core.serializers.json import DjangoJSONEncoder
from django.db.utils import IntegrityError
from django.http import JsonResponse, QueryDict
from django.shortcuts import render
from django.utils.safestring import mark_safe
from django.views.decorators.csrf import csrf_exempt

from .models import Todo


def index(request):
    if Todo.objects.count() == 0:
        Todo.objects.create(
            position=1, element_title="Sample Todo", content="This is a sample todo!"
        )
    todoEntries = Todo.objects.order_by("position")
    element_names_array = []
    for todo in todoEntries:
        element_names_array.append(str(todo.element_title))
    context = {
        "elements_name_array": mark_safe(
            json.dumps(list(element_names_array), cls=DjangoJSONEncoder)
        ),
        "todo_list": todoEntries,
        "minimum": Todo.objects.count() + 1,
    }
    return render(request, "todo/index.html", context)


def to_top(request):
    if request.method == "POST":
        position = request.POST.get("position")
        todoEntries = Todo.objects.filter(position__lt=position)
        todoSelected = Todo.objects.get(position=position)
        for todo in todoEntries:
            todo.position += 1
            todo.save()
        todoSelected.position = 1
        todoSelected.save()
        data = {
            "code": 200,
            "status": "Moved to top",
            "message": "success",
            "todo": {"new_position": todoSelected.position, "prev_position": position},
        }
        return JsonResponse(data)


def to_bottom(request):
    if request.method == "POST":
        position = request.POST.get("position")
        todoEntries = Todo.objects.filter(position__gt=position)
        todoSelected = Todo.objects.get(position=position)
        total_count = Todo.objects.count()
        for todo in todoEntries:
            todo.position -= 1
            todo.save()
        todoSelected.position = total_count
        todoSelected.save()
        data = {
            "code": 200,
            "status": "Moved to bottom",
            "message": "success",
            "todo": {"newPosition": todoSelected.position, "prevPosition": position},
        }
        return JsonResponse(data)


def to_up(request):
    if request.method == "POST":
        position = request.POST.get("position")
        todoSelected = Todo.objects.get(position=position)
        targetTodoEntry = Todo.objects.get(position=int(position) - 1)
        # swapping position values
        todoSelected.position, targetTodoEntry.position = (
            targetTodoEntry.position,
            todoSelected.position,
        )
        todoSelected.save()
        targetTodoEntry.save()
        data = {
            "code": 200,
            "status": "Moved up",
            "message": "success",
            "todo": {"newPosition": todoSelected.position, "prevPosition": position},
        }
        return JsonResponse(data)


def to_down(request):
    if request.method == "POST":
        position = request.POST.get("position")
        print(position)
        todoSelected = Todo.objects.get(position=position)
        targetTodoEntry = Todo.objects.get(position=int(position) + 1)
        # swapping position values
        todoSelected.position, targetTodoEntry.position = (
            targetTodoEntry.position,
            todoSelected.position,
        )
        todoSelected.save()
        targetTodoEntry.save()
        data = {
            "code": 200,
            "status": "Moved down",
            "message": "success",
            "todo": {"newPosition": todoSelected.position, "prevPosition": position},
        }
        return JsonResponse(data)


def todo_shift(request):
    if request.method == "POST":
        from_position = request.POST.get("from")
        to_position = request.POST.get("to")
        if int(from_position) < int(to_position):
            todoEntries = Todo.objects.filter(
                position__gt=from_position, position__lte=to_position
            )
            todoSelected = Todo.objects.get(position=from_position)
            todoSelected.position = None
            for todo in todoEntries:
                todo.position -= 1
                todo.save()
            todoSelected.position = to_position
            todoSelected.save()
            data = {
                "code": 200,
                "status": "Todo shifted",
                "message": "success",
                "todo": {
                    "newPosition": todoSelected.position,
                    "prevPosition": from_position,
                },
            }
            return JsonResponse(data)
        elif int(from_position) > int(to_position):
            todoEntries = Todo.objects.filter(
                position__gte=to_position, position__lt=from_position
            )
            todoSelected = Todo.objects.get(position=from_position)
            todoSelected.position = None
            for todo in todoEntries:
                todo.position += 1
                todo.save()
            todoSelected.position = to_position
            todoSelected.save()
            data = {
                "code": 200,
                "status": "Todo shifted",
                "message": "success",
                "todo": {
                    "newPosition": todoSelected.position,
                    "prevPosition": from_position,
                },
            }
            return JsonResponse(data)
        elif int(from_position) is int(to_position):
            data = {
                "code": 403,
                "status": "Forbidden",
                "message": "From and To values got same!",
            }
            return JsonResponse(data)


def todo_create(request):
    if request.method == "POST":
        subject = request.POST.get("subject")
        content = request.POST.get("content")
        try:
            todo = Todo.objects.create(
                position=Todo.objects.count() + 1,
                element_title=subject,
                content=content,
            )
            todo.save()
            data = {
                "code": 201,
                "status": "Created",
                "message": "Success",
                "todo": {
                    "id": todo.id,
                    "position": todo.position,
                    "subject": subject,
                    "content": content,
                },
            }
        except IntegrityError:
            data = {"code": 403, "status": "Forbidden", "message": "non-unique"}
        return JsonResponse(data)


def todo_edit(request, pk):
    if request.method == "PATCH":
        subject = QueryDict(request.body).get("new_subject")
        content = QueryDict(request.body).get("new_content")
        try:
            todo = Todo.objects.get(pk=pk)
            todo.element_title = subject
            todo.content = content
            todo.save()
            data = {
                "code": 204,
                "status": "OK",
                "message": "Edit Success",
                "todo": {
                    "id": todo.id,
                    "position": todo.position,
                    "subject": todo.element_title,
                    "content": todo.content,
                },
            }
        except Todo.DoesNotExist:
            data = {
                "code": 404,
                "status": "Not Found",
                "message": "Todo object with id {} does not exist!".format(id),
            }
        except IntegrityError:
            data = {"code": 403, "status": "Forbidden", "message": "non-unique"}
        return JsonResponse(data)


def todo_delete(request, pk):
    if request.method == "DELETE":
        try:
            todo = Todo.objects.get(pk=pk)
            position = todo.position
            todo.delete()
            data = {
                "code": 200,
                "status": "OK",
                "deletedPosition": position,
                "message": "Delete Success",
            }
        except Todo.DoesNotExist:
            data = {
                "code": 404,
                "status": "Not Found",
                "message": "Todo object with id {} does not exist!".format(id),
            }
        return JsonResponse(data)


@csrf_exempt
def clean_todos(request):
    if request.method == "DELETE":
        todos = Todo.objects.all()
        for todo in todos:
            todo.delete()
        return JsonResponse({"code": 204, "status": "OK"})
