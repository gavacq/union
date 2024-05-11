from django.views import generic

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.core.files.uploadedfile import InMemoryUploadedFile
import zipfile


class IndexView(generic.TemplateView):
    template_name = "common/index.html"


class RestViewSet(viewsets.ViewSet):
    @action(
        detail=False,
        methods=["get"],
        permission_classes=[AllowAny],
        url_path="rest-check",
    )
    def rest_check(self, request):
        return Response(
            {
                "result": "This message comes from the backend. "
                "If you're seeing this, the REST API is working!"
            },
            status=status.HTTP_200_OK,
        )

class UploadChatlog(viewsets.ViewSet):
    @action(
        detail=False,
        methods=["post"],
        permission_classes=[AllowAny],
        url_path="upload-chatlog",
    )
    def upload_file(self, request):
        file = request.data['file']

        # Ensure the file is a zip file
        if not zipfile.is_zipfile(file):
            return Response({"error": "Uploaded file is not a zip file"}, status=400)

        # Open the zip file
        with zipfile.ZipFile(file, 'r') as zip_ref:
            # Get the list of file names in the zip file
            file_names = zip_ref.namelist()

            # Ensure there is at least one file in the zip file
            if not file_names:
                return Response({"error": "Zip file is empty"}, status=400)

            # Open the first file
            with zip_ref.open(file_names[0], 'r') as f:
                # Read the first line of the file
                first_line = f.readline().decode('utf-8').strip()

        return Response({"first_line": first_line})
