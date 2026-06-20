import 'package:shared_preferences/shared_preferences.dart';

class SessionService {
  static const _userIdKey = 'userId';

  static Future<void> saveUserId(int id) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt(_userIdKey, id);
  }

  static Future<int?> getUserId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(_userIdKey);
  }

  static Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_userIdKey);
  }
}
