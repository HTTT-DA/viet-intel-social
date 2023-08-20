from django.urls import path

from core.controller import UserController

urlpatterns = [
    # user
    path('/get-user-points-of-month', UserController.getLeaderboardOfMonth),
    path('/update-information', UserController.updateUser),
    path('/<int:userId>', UserController.getUserProfileById),
    path('/get-user-for-admin/<int:userId>', UserController.getUserByIdForAdmin),
    path('/update-avatar', UserController.updateAvatar),
    path('/<int:userId>/owner-info', UserController.getInfoForQuestion),
    path('/add-user-request', UserController.addRequestAccess),
    path('/get-user-request', UserController.getRequestAccessAPI),
    path('/decline-user-request/<int:requestId>', UserController.declinePendingRequest),
    path('/accept-user-request/<int:requestId>', UserController.acceptPendingRequest),

    # auth
    path('/sign-in', UserController.signIn),
    path('/sign-in-admin', UserController.adminLogin),
    path('/change-password', UserController.changePassword),
    path('/sign-up', UserController.signUp),
    path('/get-new-access-token', UserController.getNewAccessToken),
]