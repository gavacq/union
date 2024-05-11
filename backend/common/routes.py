from .views import RestViewSet


routes = [
    {"regex": r"rest", "viewset": RestViewSet, "basename": "Rest"},
    {
        "regex": r"upload-chatlog",
        "viewset": RestViewSet,
        "basename": "UploadChatlog",
    }
]
