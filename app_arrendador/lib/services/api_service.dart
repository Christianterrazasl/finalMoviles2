import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;

import '../models/place.dart';
import '../models/reservation.dart';

class ApiService {
  static const baseUrl = 'http://67.205.172.167';

  static Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/arrendatario/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );
    if (response.statusCode != 200) {
      throw Exception('Credenciales incorrectas');
    }
    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  static Future<void> register({
    required String nombrecompleto,
    required String email,
    required String password,
    required String telefono,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/arrendatario/registro'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'nombrecompleto': nombrecompleto,
        'email': email,
        'password': password,
        'telefono': telefono,
      }),
    );
    if (response.statusCode != 200 && response.statusCode != 201) {
      throw Exception('Error al registrar');
    }
  }

  static Future<List<Place>> getPlacesByArrendatario(int arrendatarioId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/lugares/arrendatario/$arrendatarioId'),
    );
    if (response.statusCode != 200) {
      throw Exception('No se pudieron cargar los lugares');
    }
    final data = jsonDecode(response.body);
    if (data is! List) return [];
    return data.map((e) => Place.fromJson(e as Map<String, dynamic>)).toList();
  }

  static Future<Place> getPlaceById(int id) async {
    final response = await http.get(Uri.parse('$baseUrl/api/lugares/$id'));
    if (response.statusCode != 200) {
      throw Exception('No se pudo cargar el lugar');
    }
    return Place.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }

  static Future<int> savePlace(Map<String, dynamic> body) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/lugares'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(body),
    );
    if (response.statusCode != 200 && response.statusCode != 201) {
      throw Exception('No se pudo guardar el lugar');
    }
    final data = jsonDecode(response.body);
    if (data is Map<String, dynamic> && data['id'] != null) {
      return data['id'] as int;
    }
    if (body['id'] != null) {
      return body['id'] as int;
    }
    throw Exception('Respuesta inválida al guardar');
  }

  static Future<void> uploadPhoto(int lugarId, File file) async {
    final request = http.MultipartRequest(
      'POST',
      Uri.parse('$baseUrl/api/lugares/$lugarId/foto'),
    );
    request.files.add(await http.MultipartFile.fromPath('foto', file.path));
    final response = await request.send();
    if (response.statusCode != 200 && response.statusCode != 201) {
      throw Exception('No se pudo subir la foto');
    }
  }

  static Future<List<Reservation>> getReservationsByPlace(int lugarId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/reservas/lugar/$lugarId'),
    );
    if (response.statusCode != 200) {
      throw Exception('No se pudieron cargar las reservas');
    }
    final data = jsonDecode(response.body);
    if (data is! List) return [];
    return data
        .map((e) => Reservation.fromJson(e as Map<String, dynamic>))
        .toList();
  }
}
