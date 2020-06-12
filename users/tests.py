from users.models import CustomUser


class TestUserModel:
    def test_custom_user_str(self):
        user = CustomUser(username="test")
        assert user.__str__() == "test"
