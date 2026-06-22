import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:image_picker/image_picker.dart';
import 'package:latlong2/latlong.dart';

import '../constants/colors.dart';
import '../models/place.dart';
import '../services/api_service.dart';
import '../widgets/app_text_field.dart';
import 'reservations_screen.dart';

class PlaceFormScreen extends StatefulWidget {
  final int arrendatarioId;
  final int? placeId;

  const PlaceFormScreen({
    super.key,
    required this.arrendatarioId,
    this.placeId,
  });

  bool get isEditing => placeId != null;

  @override
  State<PlaceFormScreen> createState() => _PlaceFormScreenState();
}

class _PlaceFormScreenState extends State<PlaceFormScreen> {
  final _nombreController = TextEditingController();
  final _descripcionController = TextEditingController();
  final _personasController = TextEditingController();
  final _camasController = TextEditingController();
  final _baniosController = TextEditingController();
  final _habitacionesController = TextEditingController();
  final _parqueoController = TextEditingController(text: '0');
  final _precioController = TextEditingController();
  final _limpiezaController = TextEditingController();
  final _ciudadController = TextEditingController();
  final _mapController = MapController();

  bool _tieneWifi = false;
  bool _loading = false;
  bool _loadingData = false;
  LatLng _selectedLocation = const LatLng(-17.783334, -63.182108);
  final List<File> _newPhotos = [];
  List<String> _existingPhotoUrls = [];

  @override
  void initState() {
    super.initState();
    if (widget.isEditing) {
      _loadPlace();
    }
  }

  @override
  void dispose() {
    _nombreController.dispose();
    _descripcionController.dispose();
    _personasController.dispose();
    _camasController.dispose();
    _baniosController.dispose();
    _habitacionesController.dispose();
    _parqueoController.dispose();
    _precioController.dispose();
    _limpiezaController.dispose();
    _ciudadController.dispose();
    super.dispose();
  }

  Future<void> _loadPlace() async {
    setState(() => _loadingData = true);
    try {
      final place = await ApiService.getPlaceById(widget.placeId!);
      _fillForm(place);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: AppColors.error),
        );
      }
    } finally {
      if (mounted) setState(() => _loadingData = false);
    }
  }

  void _fillForm(Place place) {
    _nombreController.text = place.nombre;
    _descripcionController.text = place.descripcion;
    _personasController.text = place.cantPersonas.toString();
    _camasController.text = place.cantCamas.toString();
    _baniosController.text = place.cantBanios.toString();
    _habitacionesController.text = place.cantHabitaciones.toString();
    _parqueoController.text = place.cantVehiculosParqueo.toString();
    _precioController.text = place.precioNoche.toString();
    _limpiezaController.text = place.costoLimpieza.toString();
    _ciudadController.text = place.ciudad;
    _tieneWifi = place.tieneWifi == 1;
    _selectedLocation = LatLng(place.latitud, place.longitud);
    _existingPhotoUrls = place.fotos
        .map((f) => f.url.startsWith('http') ? f.url : 'http://${f.url}')
        .toList();
    setState(() {});
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _mapController.move(_selectedLocation, 14);
    });
  }

  Future<void> _pickPhotos() async {
    final picker = ImagePicker();
    final images = await picker.pickMultiImage();
    if (images.isEmpty) return;
    setState(() {
      _newPhotos.addAll(images.map((x) => File(x.path)));
    });
  }

  Future<void> _save() async {
    if (_nombreController.text.trim().isEmpty ||
        _ciudadController.text.trim().isEmpty ||
        _precioController.text.trim().isEmpty) {
      _showError('Complete los campos obligatorios');
      return;
    }

    setState(() => _loading = true);
    try {
      final body = <String, dynamic>{
        'nombre': _nombreController.text.trim(),
        'descripcion': _descripcionController.text.trim(),
        'cantPersonas': int.tryParse(_personasController.text) ?? 0,
        'cantCamas': int.tryParse(_camasController.text) ?? 0,
        'cantBanios': int.tryParse(_baniosController.text) ?? 0,
        'cantHabitaciones': int.tryParse(_habitacionesController.text) ?? 0,
        'tieneWifi': _tieneWifi ? 1 : 0,
        'cantVehiculosParqueo': int.tryParse(_parqueoController.text) ?? 0,
        'precioNoche': _precioController.text.trim(),
        'costoLimpieza': _limpiezaController.text.trim(),
        'ciudad': _ciudadController.text.trim(),
        'latitud': _selectedLocation.latitude.toString(),
        'longitud': _selectedLocation.longitude.toString(),
        'arrendatario_id': widget.arrendatarioId,
      };

      final lugarId = await ApiService.savePlace(body);

      for (final photo in _newPhotos) {
        await ApiService.uploadPhoto(lugarId, photo);
      }

      if (!mounted) return;
      Navigator.pop(context, true);
    } catch (e) {
      _showError(e.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), backgroundColor: AppColors.error),
    );
  }

  void _openReservations() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => ReservationsScreen(
          lugarId: widget.placeId!,
          placeName: _nombreController.text.trim(),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        iconTheme: const IconThemeData(color: AppColors.text),
        title: Text(
          widget.isEditing ? 'Ver lugar' : 'Nuevo lugar',
          style: const TextStyle(color: AppColors.text, fontWeight: FontWeight.bold),
        ),
      ),
      body: SafeArea(
        top: false,
        child: _loadingData
            ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
            : SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  _sectionTitle('Fotos'),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      ..._existingPhotoUrls.map(_existingPhoto),
                      ..._newPhotos.map(_newPhoto),
                      if (!widget.isEditing) _addPhotoButton(),
                    ],
                  ),
                  const SizedBox(height: 16),
                  AppTextField(hint: 'Nombre', controller: _nombreController, readOnly: widget.isEditing),
                  const SizedBox(height: 10),
                  AppTextField(
                    hint: 'Descripción',
                    controller: _descripcionController,
                    maxLines: 3,
                    readOnly: widget.isEditing,
                  ),
                  const SizedBox(height: 10),
                  _numberField('Personas', _personasController),
                  const SizedBox(height: 10),
                  _numberField('Camas', _camasController),
                  const SizedBox(height: 10),
                  _numberField('Baños', _baniosController),
                  const SizedBox(height: 10),
                  _numberField('Habitaciones', _habitacionesController),
                  const SizedBox(height: 10),
                  SwitchListTile(
                    contentPadding: EdgeInsets.zero,
                    title: const Text('Tiene Wi-Fi', style: TextStyle(color: AppColors.text)),
                    value: _tieneWifi,
                    activeTrackColor: AppColors.primary.withValues(alpha: 0.4),
                    thumbColor: WidgetStateProperty.all(AppColors.primary),
                    onChanged: widget.isEditing ? null : (v) => setState(() => _tieneWifi = v),
                  ),
                  const SizedBox(height: 10),
                  _numberField('Parqueo (vehículos)', _parqueoController),
                  const SizedBox(height: 10),
                  _numberField('Precio por noche', _precioController),
                  const SizedBox(height: 10),
                  _numberField('Costo de limpieza', _limpiezaController),
                  const SizedBox(height: 10),
                  AppTextField(hint: 'Ciudad', controller: _ciudadController, readOnly: widget.isEditing),
                  const SizedBox(height: 16),
                  _sectionTitle('Ubicación en el mapa'),
                  SizedBox(
                    height: 220,
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: FlutterMap(
                        mapController: _mapController,
                        options: MapOptions(
                          initialCenter: _selectedLocation,
                          initialZoom: 12,
                          onTap: widget.isEditing
                              ? null
                              : (_, point) {
                                  setState(() => _selectedLocation = point);
                                },
                        ),
                        children: [
                          TileLayer(
                            urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                            userAgentPackageName: 'com.example.app_arrendador',
                          ),
                          MarkerLayer(
                            markers: [
                              Marker(
                                point: _selectedLocation,
                                width: 40,
                                height: 40,
                                child: const Icon(
                                  Icons.location_on,
                                  color: AppColors.primary,
                                  size: 40,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Lat: ${_selectedLocation.latitude.toStringAsFixed(5)}, '
                    'Lng: ${_selectedLocation.longitude.toStringAsFixed(5)}',
                    style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
                  ),
                  const SizedBox(height: 20),
                  if (widget.isEditing)
                    OutlinedButton(
                      onPressed: _openReservations,
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppColors.secondary,
                        side: const BorderSide(color: AppColors.secondary),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                      child: const Text(
                        'Ver reservas',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                    ),
                  if (!widget.isEditing)
                    PrimaryButton(
                      label: 'Guardar',
                      loading: _loading,
                      onPressed: _save,
                    ),
                ],
              ),
            ),
      ),
    );
  }

  Widget _sectionTitle(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(
        text,
        style: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.bold,
          color: AppColors.text,
        ),
      ),
    );
  }

  Widget _numberField(String hint, TextEditingController controller) {
    return AppTextField(
      hint: hint,
      controller: controller,
      keyboardType: TextInputType.number,
      readOnly: widget.isEditing,
    );
  }

  Widget _existingPhoto(String url) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(8),
      child: Image.network(url, width: 80, height: 80, fit: BoxFit.cover),
    );
  }

  Widget _newPhoto(File file) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(8),
      child: Image.file(file, width: 80, height: 80, fit: BoxFit.cover),
    );
  }

  Widget _addPhotoButton() {
    return InkWell(
      onTap: _pickPhotos,
      child: Container(
        width: 80,
        height: 80,
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: AppColors.border),
        ),
        child: const Icon(Icons.add_a_photo, color: AppColors.textMuted),
      ),
    );
  }
}
