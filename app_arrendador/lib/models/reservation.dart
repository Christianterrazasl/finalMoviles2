import 'place.dart';

class Cliente {
  final int id;
  final String nombrecompleto;

  Cliente({required this.id, required this.nombrecompleto});

  factory Cliente.fromJson(Map<String, dynamic> json) {
    return Cliente(
      id: json['id'] as int? ?? 0,
      nombrecompleto: json['nombrecompleto'] as String? ?? 'Cliente',
    );
  }
}

class Reservation {
  final int id;
  final String fechaInicio;
  final String fechaFin;
  final double precioTotal;
  final Cliente? cliente;
  final Place? lugar;

  Reservation({
    required this.id,
    required this.fechaInicio,
    required this.fechaFin,
    required this.precioTotal,
    this.cliente,
    this.lugar,
  });

  factory Reservation.fromJson(Map<String, dynamic> json, {Place? parentPlace}) {
    Place? lugar = parentPlace;
    if (lugar == null) {
      final lugarData = json['lugar'];
      if (lugarData is Map<String, dynamic>) {
        lugar = Place.fromJson(lugarData);
      } else if (lugarData is List && lugarData.isNotEmpty) {
        lugar = Place.fromJson(lugarData.first as Map<String, dynamic>);
      }
    }

    Cliente? cliente;
    final clienteData = json['cliente'];
    if (clienteData is Map<String, dynamic>) {
      cliente = Cliente.fromJson(clienteData);
    }

    return Reservation(
      id: json['id'] as int? ?? 0,
      fechaInicio: json['fechaInicio'] as String? ?? '',
      fechaFin: json['fechaFin'] as String? ?? '',
      precioTotal: _toDouble(json['precioTotal']),
      cliente: cliente,
      lugar: lugar,
    );
  }

  static double _toDouble(dynamic value) {
    if (value == null) return 0;
    if (value is num) return value.toDouble();
    return double.tryParse(value.toString()) ?? 0;
  }

  int get noches {
    try {
      final inicio = DateTime.parse(fechaInicio);
      final fin = DateTime.parse(fechaFin);
      return fin.difference(inicio).inDays;
    } catch (_) {
      return 0;
    }
  }

  String? get placePhotoUrl => lugar?.firstPhotoUrl;
}
