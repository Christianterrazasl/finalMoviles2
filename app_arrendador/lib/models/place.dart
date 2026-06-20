class Foto {
  final int id;
  final String url;

  Foto({required this.id, required this.url});

  factory Foto.fromJson(Map<String, dynamic> json) {
    return Foto(
      id: json['id'] as int,
      url: json['url'] as String,
    );
  }
}

class Place {
  final int id;
  final String nombre;
  final String descripcion;
  final int cantPersonas;
  final int cantCamas;
  final int cantBanios;
  final int cantHabitaciones;
  final int tieneWifi;
  final int cantVehiculosParqueo;
  final double precioNoche;
  final double costoLimpieza;
  final String ciudad;
  final double latitud;
  final double longitud;
  final int arrendatarioId;
  final List<Foto> fotos;

  Place({
    required this.id,
    required this.nombre,
    required this.descripcion,
    required this.cantPersonas,
    required this.cantCamas,
    required this.cantBanios,
    required this.cantHabitaciones,
    required this.tieneWifi,
    required this.cantVehiculosParqueo,
    required this.precioNoche,
    required this.costoLimpieza,
    required this.ciudad,
    required this.latitud,
    required this.longitud,
    required this.arrendatarioId,
    required this.fotos,
  });

  factory Place.fromJson(Map<String, dynamic> json) {
    final fotosJson = json['fotos'] as List<dynamic>? ?? [];
    return Place(
      id: json['id'] as int,
      nombre: json['nombre'] as String? ?? '',
      descripcion: json['descripcion'] as String? ?? '',
      cantPersonas: _toInt(json['cantPersonas']),
      cantCamas: _toInt(json['cantCamas']),
      cantBanios: _toInt(json['cantBanios']),
      cantHabitaciones: _toInt(json['cantHabitaciones']),
      tieneWifi: _toInt(json['tieneWifi']),
      cantVehiculosParqueo: _toInt(json['cantVehiculosParqueo']),
      precioNoche: _toDouble(json['precioNoche']),
      costoLimpieza: _toDouble(json['costoLimpieza']),
      ciudad: json['ciudad'] as String? ?? '',
      latitud: _toDouble(json['latitud']),
      longitud: _toDouble(json['longitud']),
      arrendatarioId: _toInt(json['arrendatario_id']),
      fotos: fotosJson.map((e) => Foto.fromJson(e as Map<String, dynamic>)).toList(),
    );
  }

  static int _toInt(dynamic value) {
    if (value == null) return 0;
    if (value is int) return value;
    return int.tryParse(value.toString()) ?? 0;
  }

  static double _toDouble(dynamic value) {
    if (value == null) return 0;
    if (value is num) return value.toDouble();
    return double.tryParse(value.toString()) ?? 0;
  }

  String? get firstPhotoUrl {
    if (fotos.isEmpty) return null;
    final url = fotos.first.url;
    return url.startsWith('http') ? url : 'http://$url';
  }
}
